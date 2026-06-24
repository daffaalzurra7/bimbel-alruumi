import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/presensi/[id] — Hapus presensi
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check ownership
    const presensi = await prisma.absensiKerja.findUnique({ where: { id } });
    if (!presensi) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Presensi tidak ditemukan" } },
        { status: 404 }
      );
    }

    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (presensi.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Anda tidak bisa menghapus presensi ini" } },
        { status: 403 }
      );
    }

    await prisma.absensiKerja.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error("DELETE /api/presensi/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } },
      { status: 500 }
    );
  }
}
