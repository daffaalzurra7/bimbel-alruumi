import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/laporan
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }

    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    const { searchParams } = new URL(req.url);
    const mentorId = searchParams.get("mentorId");

    const data = await prisma.laporanHarian.findMany({
      where: {
        ...(isAdmin && mentorId ? { mentorId } : {}),
        ...(!isAdmin ? { mentorId: session.user.id } : {}),
      },
      orderBy: { tanggal: "desc" },
      include: {
        siswa: { select: { namaLengkap: true } },
        mentor: { select: { nama: true } },
      },
      take: 50,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/laporan error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

// POST /api/laporan
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }

    const body = await req.json();
    const { siswaId, tanggal, materiDipelajari, perkembangan, nilaiTO, pekerjaan, catatanKhusus } = body;

    if (!siswaId || !tanggal || !materiDipelajari || !perkembangan) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Siswa, tanggal, materi, dan perkembangan wajib diisi" } }, { status: 422 });
    }

    const data = await prisma.laporanHarian.create({
      data: {
        siswaId,
        mentorId: session.user.id,
        tanggal: new Date(tanggal),
        materiDipelajari,
        perkembangan,
        nilaiTO: nilaiTO || null,
        pekerjaan: pekerjaan || null,
        catatanKhusus: catatanKhusus || null,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/laporan error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
