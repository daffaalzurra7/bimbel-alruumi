import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } }, { status: 401 });
    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } }, { status: 403 });

    const data = await prisma.user.findMany({
      where: { role: "MENTOR", deletedAt: null },
      select: { id: true, nama: true, email: true, noHp: true, alamat: true, isAktif: true, createdAt: true },
      orderBy: { nama: "asc" },
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
    const { nama, email, password, noHp, alamat } = body;
    if (!nama || !email || !password) {
      return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Nama, email, dan password wajib diisi" } }, { status: 422 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: { code: "CONFLICT", message: "Email sudah terdaftar" } }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const data = await prisma.user.create({
      data: { nama, email, password: hashedPassword, role: "MENTOR", noHp: noHp || null, alamat: alamat || null },
      select: { id: true, nama: true, email: true, noHp: true, isAktif: true },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } }, { status: 500 });
  }
}
