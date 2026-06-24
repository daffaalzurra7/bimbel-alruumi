import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const data = await prisma.pembayaran.findMany({
      orderBy: [{ tahun: "desc" }, { bulan: "desc" }],
      include: { siswa: { select: { namaLengkap: true, jenjang: true, kelas: true } } },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const body = await req.json();
    const { siswaId, bulan, tahun, jumlah } = body;
    if (!siswaId || !bulan || !tahun || !jumlah) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Semua field wajib diisi" } }, { status: 422 });
    }

    const data = await prisma.pembayaran.create({
      data: { siswaId, bulan, tahun, jumlah },
      include: { siswa: { select: { namaLengkap: true } } },
    });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
