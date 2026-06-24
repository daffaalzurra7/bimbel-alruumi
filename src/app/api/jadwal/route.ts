import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    const mentorId = searchParams.get("mentorId");

    const data = await prisma.jadwal.findMany({
      where: {
        isAktif: true,
        ...(isAdmin && mentorId ? { mentorId } : {}),
        ...(!isAdmin ? { mentorId: session.user.id } : {}),
      },
      include: {
        siswa: { select: { id: true, namaLengkap: true, jenjang: true, kelas: true } },
        mentor: { select: { nama: true } },
      },
      orderBy: { createdAt: "desc" },
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
    const { siswaId, mentorId, hariMengajar, jamMulai, jamSelesai, mataPelajaran, catatan } = body;

    if (!siswaId || !mentorId || !hariMengajar?.length || !jamMulai || !jamSelesai || !mataPelajaran?.length) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Semua field wajib diisi" } }, { status: 422 });
    }

    const data = await prisma.jadwal.create({
      data: {
        siswaId, mentorId, hariMengajar, jamMulai, jamSelesai, mataPelajaran,
        tanggalMulai: new Date(),
        catatan: catatan || null,
      },
      include: {
        siswa: { select: { namaLengkap: true } },
        mentor: { select: { nama: true } },
      },
    });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
