import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }
    const { id } = await params;
    const catatan = await prisma.catatanMentorBulanan.findUnique({ where: { id } });
    if (!catatan) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Catatan tidak ditemukan" } }, { status: 404 });

    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (catatan.mentorId !== session.user.id && !isAdmin) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Tidak punya akses" } }, { status: 403 });
    }
    await prisma.catatanMentorBulanan.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
