import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    const data = await prisma.catatanMentorBulanan.findMany({
      where: isAdmin ? {} : { mentorId: session.user.id },
      orderBy: [{ tahun: "desc" }, { bulan: "desc" }],
      include: { mentor: { select: { nama: true } } },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/catatan-bulanan error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }
    const body = await req.json();
    const { bulan, tahun, catatanMateri, refleksi } = body;
    if (!bulan || !tahun || !catatanMateri) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Bulan, tahun, dan catatan wajib diisi" } }, { status: 422 });
    }

    // Upsert: jika sudah ada catatan untuk bulan+tahun ini, update
    const data = await prisma.catatanMentorBulanan.upsert({
      where: { mentorId_bulan_tahun: { mentorId: session.user.id, bulan, tahun } },
      update: { catatanMateri, refleksi: refleksi || null },
      create: { mentorId: session.user.id, bulan, tahun, catatanMateri, refleksi: refleksi || null },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/catatan-bulanan error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
