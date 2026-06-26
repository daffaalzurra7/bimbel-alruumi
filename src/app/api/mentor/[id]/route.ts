import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/mentor/[id] — Get mentor detail with stats
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const bulan = parseInt(searchParams.get("bulan") || String(new Date().getMonth() + 1));
    const tahun = parseInt(searchParams.get("tahun") || String(new Date().getFullYear()));

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0);

    // Get mentor info
    const mentor = await prisma.user.findUnique({
      where: { id },
      select: { id: true, nama: true, email: true, noHp: true, alamat: true, isAktif: true, createdAt: true },
    });
    if (!mentor) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Mentor tidak ditemukan" } }, { status: 404 });

    // Get presensi for the month:
    // 1. Presensi created by this mentor (where NOT delegated to a substitute)
    // 2. Presensi where this mentor WAS the substitute
    const [ownPresensi, penggantiPresensi] = await Promise.all([
      prisma.absensiKerja.findMany({
        where: { userId: id, mentorPenggantiId: null, tanggal: { gte: startDate, lte: endDate } },
        orderBy: [{ tanggal: "desc" }, { jamMasuk: "desc" }],
        include: {
          siswa: { select: { id: true, namaLengkap: true, jenjang: true, kelas: true } },
          mentorPengganti: { select: { id: true, nama: true } },
          user: { select: { id: true, nama: true } },
        },
      }),
      prisma.absensiKerja.findMany({
        where: { mentorPenggantiId: id, tanggal: { gte: startDate, lte: endDate } },
        orderBy: [{ tanggal: "desc" }, { jamMasuk: "desc" }],
        include: {
          siswa: { select: { id: true, namaLengkap: true, jenjang: true, kelas: true } },
          mentorPengganti: { select: { id: true, nama: true } },
          user: { select: { id: true, nama: true } },
        },
      }),
    ]);
    // Merge: honor-eligible presensi = own (no substitute) + substitute assignments
    const presensi = [...ownPresensi, ...penggantiPresensi].sort((a, b) => {
      const dateCompare = new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
      return dateCompare || b.jamMasuk.localeCompare(a.jamMasuk);
    });

    // Get jadwal with fee info
    const jadwal = await prisma.jadwal.findMany({
      where: { mentorId: id, isAktif: true },
      include: { siswa: { select: { id: true, namaLengkap: true, jenjang: true, kelas: true } } },
    });

    // Get bonus for the month
    const bonus = await prisma.bonusMentor.findMany({
      where: { mentorId: id, bulan, tahun },
    });

    // Calculate honor — use per-student fee from jadwal
    const totalSesi = presensi.length;
    const totalMenit = presensi.reduce((sum, p) => sum + p.durasiMenit, 0);

    // Build jadwal fee lookup by siswaId
    const feeMap = new Map<string, { fee: number; transport: number }>();
    for (const j of jadwal) {
      feeMap.set(j.siswaId, { fee: Number(j.feeMengajar), transport: Number(j.transportFee) });
    }

    // Calculate fee per presensi using matched student fee
    let totalFee = 0;
    let totalTransport = 0;
    const sesiCountMap = new Map<string, { nama: string; jenjang: string; kelas: string; count: number; fee: number; transport: number }>();

    for (const p of presensi) {
      const sid = p.siswaId;
      if (sid && feeMap.has(sid)) {
        const { fee, transport } = feeMap.get(sid)!;
        totalFee += fee;
        totalTransport += transport;
      } else if (jadwal.length > 0) {
        // Fallback: average fee
        const avgFee = jadwal.reduce((s, j) => s + Number(j.feeMengajar), 0) / jadwal.length;
        const avgTransport = jadwal.reduce((s, j) => s + Number(j.transportFee), 0) / jadwal.length;
        totalFee += avgFee;
        totalTransport += avgTransport;
      }

      // Count sesi per siswa
      if (sid && p.siswa) {
        const existing = sesiCountMap.get(sid);
        if (existing) {
          existing.count += 1;
        } else {
          const fees = feeMap.get(sid);
          sesiCountMap.set(sid, {
            nama: p.siswa.namaLengkap,
            jenjang: p.siswa.jenjang,
            kelas: p.siswa.kelas,
            count: 1,
            fee: fees?.fee || 0,
            transport: fees?.transport || 0,
          });
        }
      }
    }

    const sesiPerSiswa = Array.from(sesiCountMap.entries()).map(([siswaId, data]) => ({
      siswaId,
      ...data,
      totalFee: data.count * data.fee,
      totalTransport: data.count * data.transport,
    }));

    const totalBonus = bonus.reduce((sum, b) => sum + Number(b.jumlah), 0);
    const totalHonor = totalFee + totalTransport + totalBonus;

    // Laporan count
    const laporanCount = await prisma.laporanHarian.count({
      where: { mentorId: id, tanggal: { gte: startDate, lte: endDate } },
    });

    return NextResponse.json({
      success: true,
      data: {
        mentor,
        presensi,
        jadwal,
        bonus,
        sesiPerSiswa,
        stats: {
          totalSesi,
          totalMenit,
          totalJam: Math.round(totalMenit / 60 * 10) / 10,
          totalFee: Math.round(totalFee),
          totalTransport: Math.round(totalTransport),
          totalBonus,
          totalHonor: Math.round(totalHonor),
          laporanCount,
          jumlahSiswa: jadwal.length,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/mentor/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { password, role, ...updateData } = body;
    const data = await prisma.user.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: { id: data.id, nama: data.nama, email: data.email, isAktif: data.isAktif } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const { id } = await params;
    await prisma.user.update({ where: { id }, data: { deletedAt: new Date(), isAktif: false } });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
