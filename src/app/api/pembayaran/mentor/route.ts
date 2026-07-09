import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/pembayaran/mentor — List mentor honor payment status
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN" } }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const bulan = parseInt(searchParams.get("bulan") || String(new Date().getMonth() + 1));
    const tahun = parseInt(searchParams.get("tahun") || String(new Date().getFullYear()));

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0);

    // Get all active mentors
    const mentors = await prisma.user.findMany({
      where: { role: "MENTOR", isAktif: true, deletedAt: null },
      select: { id: true, nama: true, email: true },
      orderBy: { nama: "asc" },
    });

    // For each mentor, calculate honor
    const mentorHonors = await Promise.all(mentors.map(async (mentor) => {
      // Own presensi (no substitute) + presensi as substitute
      const [ownPresensi, penggantiPresensi] = await Promise.all([
        prisma.absensiKerja.findMany({
          where: { userId: mentor.id, mentorPenggantiId: null, tanggal: { gte: startDate, lte: endDate } },
          include: { siswa: { select: { id: true } } },
        }),
        prisma.absensiKerja.findMany({
          where: { mentorPenggantiId: mentor.id, tanggal: { gte: startDate, lte: endDate } },
          include: { siswa: { select: { id: true } } },
        }),
      ]);
      const allPresensi = [...ownPresensi, ...penggantiPresensi];

      // Get jadwal fee info
      const jadwal = await prisma.jadwal.findMany({
        where: { mentorId: mentor.id, isAktif: true },
      });
      const feeMap = new Map<string, { fee: number; transport: number }>();
      for (const j of jadwal) {
        feeMap.set(j.siswaId, { fee: Number(j.feeMengajar), transport: Number(j.transportFee) });
      }

      let totalFee = 0, totalTransport = 0;
      for (const p of allPresensi) {
        if (p.siswaId && feeMap.has(p.siswaId)) {
          const f = feeMap.get(p.siswaId)!;
          totalFee += f.fee;
          totalTransport += f.transport;
        } else if (jadwal.length > 0) {
          const avgFee = jadwal.reduce((s, j) => s + Number(j.feeMengajar), 0) / jadwal.length;
          const avgTrp = jadwal.reduce((s, j) => s + Number(j.transportFee), 0) / jadwal.length;
          totalFee += avgFee;
          totalTransport += avgTrp;
        }
      }

      const bonus = await prisma.bonusMentor.findMany({
        where: { mentorId: mentor.id, bulan, tahun },
      });
      const totalBonus = bonus.reduce((s, b) => s + Number(b.jumlah), 0);
      const totalHonor = Math.round(totalFee + totalTransport + totalBonus);

      // Check if payment record exists
      const payment = await prisma.pembayaranMentor.findUnique({
        where: { mentorId_bulan_tahun: { mentorId: mentor.id, bulan, tahun } },
      });

      return {
        mentorId: mentor.id,
        nama: mentor.nama,
        email: mentor.email,
        totalSesi: allPresensi.length,
        totalFee: Math.round(totalFee),
        totalTransport: Math.round(totalTransport),
        totalBonus,
        totalHonor,
        payment: payment ? {
          id: payment.id,
          status: payment.status,
          jumlahDibayar: Number(payment.jumlahDibayar),
          dibayarAt: payment.dibayarAt,
          catatan: payment.catatan,
        } : null,
      };
    }));

    return NextResponse.json({ success: true, data: mentorHonors });
  } catch (error) {
    console.error("GET /api/pembayaran/mentor error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

// POST /api/pembayaran/mentor — Mark mentor as paid or create/update payment
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN" } }, { status: 403 });

    const body = await req.json();
    const { mentorId, bulan, tahun, totalHonor, jumlahDibayar, status, catatan } = body;

    if (!mentorId || !bulan || !tahun) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Data wajib belum lengkap" } }, { status: 422 });
    }

    const data = await prisma.pembayaranMentor.upsert({
      where: { mentorId_bulan_tahun: { mentorId, bulan, tahun } },
      create: {
        mentorId, bulan, tahun,
        totalHonor: totalHonor || 0,
        jumlahDibayar: jumlahDibayar || totalHonor || 0,
        status: status || "SUDAH_DIBAYAR",
        catatan: catatan || null,
        dibayarAt: new Date(),
      },
      update: {
        totalHonor: totalHonor || undefined,
        jumlahDibayar: jumlahDibayar !== undefined ? jumlahDibayar : undefined,
        status: status || undefined,
        catatan: catatan !== undefined ? catatan : undefined,
        dibayarAt: status === "SUDAH_DIBAYAR" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("POST /api/pembayaran/mentor error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
