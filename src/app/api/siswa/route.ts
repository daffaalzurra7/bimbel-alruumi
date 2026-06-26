import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/siswa — List siswa
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine");
    const isAdmin = (session.user as { role: string }).role === "ADMIN";

    if (mine === "true" || !isAdmin) {
      // Mentor: get siswa by active jadwal
      const jadwalList = await prisma.jadwal.findMany({
        where: { mentorId: session.user.id, isAktif: true },
        include: {
          siswa: true,
        },
      });

      const siswaMap = new Map();
      for (const j of jadwalList) {
        if (!siswaMap.has(j.siswa.id)) {
          siswaMap.set(j.siswa.id, {
            ...j.siswa,
            jadwal: [],
          });
        }
        siswaMap.get(j.siswa.id).jadwal.push({
          hariMengajar: j.hariMengajar,
          jamMulai: j.jamMulai,
          jamSelesai: j.jamSelesai,
          mataPelajaran: j.mataPelajaran,
        });
      }

      return NextResponse.json({ success: true, data: Array.from(siswaMap.values()) });
    }

    // Admin: get all siswa with mentor info
    const status = searchParams.get("status");
    const jenjang = searchParams.get("jenjang");
    const mentorId = searchParams.get("mentorId");

    // Base filter
    const where: Record<string, unknown> = { deletedAt: null };
    if (status) where.status = status;
    if (jenjang) where.jenjang = jenjang;
    if (mentorId) {
      where.jadwal = { some: { mentorId, isAktif: true } };
    }

    const siswa = await prisma.siswa.findMany({
      where,
      orderBy: { namaLengkap: "asc" },
      include: {
        jadwal: {
          where: { isAktif: true },
          select: { mentor: { select: { id: true, nama: true } } },
        },
      },
    });

    // Transform: add mentor names
    const data = siswa.map((s) => {
      const mentors = [...new Map(s.jadwal.map((j) => [j.mentor.id, j.mentor])).values()];
      return { ...s, mentors, jadwal: undefined };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/siswa error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } },
      { status: 500 }
    );
  }
}

// POST /api/siswa — Tambah siswa baru (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHENTICATED", message: "Silakan login" } },
        { status: 401 }
      );
    }

    const isAdmin = (session.user as { role: string }).role === "ADMIN";
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { namaLengkap, namaOrtu, noHpOrtu, emailOrtu, jenjang, kelas, sekolahAsal, alamatRumah, programBelajar } = body;

    if (!namaLengkap || !namaOrtu || !noHpOrtu || !jenjang || !kelas || !alamatRumah || !programBelajar) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Data wajib belum lengkap" } },
        { status: 422 }
      );
    }

    const siswa = await prisma.siswa.create({
      data: { namaLengkap, namaOrtu, noHpOrtu, emailOrtu, jenjang, kelas, sekolahAsal, alamatRumah, programBelajar },
    });

    return NextResponse.json({ success: true, data: siswa }, { status: 201 });
  } catch (error) {
    console.error("POST /api/siswa error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } },
      { status: 500 }
    );
  }
}
