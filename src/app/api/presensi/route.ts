import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/presensi
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    const now = new Date();
    const filterBulan = bulan ? parseInt(bulan) : now.getMonth() + 1;
    const filterTahun = tahun ? parseInt(tahun) : now.getFullYear();
    const startDate = new Date(filterTahun, filterBulan - 1, 1);
    const endDate = new Date(filterTahun, filterBulan, 0);

    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    const mentorId = searchParams.get("mentorId");

    const where = {
      tanggal: { gte: startDate, lte: endDate },
      ...(isAdmin && mentorId ? { userId: mentorId } : {}),
      ...(!isAdmin ? { userId: session.user.id } : {}),
    };

    const data = await prisma.absensiKerja.findMany({
      where,
      orderBy: [{ tanggal: "desc" }, { jamMasuk: "desc" }],
      include: {
        user: { select: { id: true, nama: true, email: true } },
        siswa: { select: { id: true, namaLengkap: true, jenjang: true, kelas: true } },
        mentorPengganti: { select: { id: true, nama: true } },
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/presensi error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

// POST /api/presensi
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });

    const body = await req.json();
    const { tanggal, jamMasuk, durasiMenit, catatan, siswaId, mentorPenggantiId } = body;

    if (!tanggal || !jamMasuk || !durasiMenit) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Tanggal, jam masuk, dan durasi wajib diisi" } }, { status: 422 });
    }
    if (![60, 90, 120].includes(durasiMenit)) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Durasi harus 60, 90, atau 120 menit" } }, { status: 422 });
    }

    const presensi = await prisma.absensiKerja.create({
      data: {
        userId: session.user.id,
        siswaId: siswaId || null,
        mentorPenggantiId: mentorPenggantiId || null,
        tanggal: new Date(tanggal),
        jamMasuk,
        durasiMenit,
        catatan: catatan || null,
      },
      include: {
        siswa: { select: { namaLengkap: true } },
        mentorPengganti: { select: { nama: true } },
      },
    });

    return NextResponse.json({ success: true, data: presensi }, { status: 201 });
  } catch (error) {
    console.error("POST /api/presensi error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
