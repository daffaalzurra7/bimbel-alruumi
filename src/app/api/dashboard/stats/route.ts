import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED" } }, { status: 401 });
    }

    const role = (session.user as { role: string }).role;
    const userId = session.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (role === "ADMIN") {
      const [totalMentor, totalSiswa, pembayaranPending, laporanHariIni, presensiHariIni] = await Promise.all([
        prisma.user.count({ where: { role: "MENTOR", isAktif: true, deletedAt: null } }),
        prisma.siswa.count({ where: { status: "AKTIF", deletedAt: null } }),
        prisma.pembayaran.count({ where: { status: "MENUNGGU_VERIFIKASI" } }),
        prisma.laporanHarian.count({ where: { tanggal: { gte: today, lt: tomorrow } } }),
        prisma.absensiKerja.count({ where: { tanggal: { gte: today, lt: tomorrow } } }),
      ]);

      return NextResponse.json({
        success: true,
        data: { totalMentor, totalSiswa, pembayaranPending, laporanHariIni, presensiHariIni },
      });
    } else {
      // MENTOR stats
      const [presensiBulanIni, siswaAktif, laporanBulanIni, totalMenitBulanIni] = await Promise.all([
        prisma.absensiKerja.count({ where: { userId, tanggal: { gte: startOfMonth, lte: endOfMonth } } }),
        prisma.jadwal.count({ where: { mentorId: userId, isAktif: true } }),
        prisma.laporanHarian.count({ where: { mentorId: userId, tanggal: { gte: startOfMonth, lte: endOfMonth } } }),
        prisma.absensiKerja.aggregate({
          where: { userId, tanggal: { gte: startOfMonth, lte: endOfMonth } },
          _sum: { durasiMenit: true },
        }),
      ]);

      const totalJam = Math.round((totalMenitBulanIni._sum.durasiMenit || 0) / 60 * 10) / 10;

      return NextResponse.json({
        success: true,
        data: { presensiBulanIni, siswaAktif, laporanBulanIni, totalJam },
      });
    }
  } catch (error) {
    console.error("GET /api/dashboard/stats error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
