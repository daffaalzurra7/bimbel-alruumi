import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/siswa/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const siswa = await prisma.siswa.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: siswa });
  } catch (error) {
    console.error("PATCH /api/siswa/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}

// DELETE /api/siswa/[id] — Soft delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    }
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });
    }

    const { id } = await params;

    await prisma.siswa.update({
      where: { id },
      data: { deletedAt: new Date(), status: "NONAKTIF" },
    });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error("DELETE /api/siswa/[id] error:", error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
