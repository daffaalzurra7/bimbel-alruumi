import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/mentor/[id]/bonus — Add bonus for mentor
export async function POST(
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
    const { bulan, tahun, jumlah, keterangan } = body;

    if (!bulan || !tahun || !jumlah) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Bulan, tahun, dan jumlah wajib diisi" } }, { status: 422 });
    }

    const data = await prisma.bonusMentor.create({
      data: { mentorId: id, bulan, tahun, jumlah, keterangan: keterangan || null },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

// DELETE /api/mentor/[id]/bonus?bonusId=xxx
export async function DELETE(
  req: NextRequest,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const bonusId = searchParams.get("bonusId");
    if (!bonusId) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "bonusId required" } }, { status: 422 });

    await prisma.bonusMentor.delete({ where: { id: bonusId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
