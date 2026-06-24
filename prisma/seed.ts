// prisma/seed.ts
// Seed data: 1 admin, 2 mentor, 5 siswa, jadwal, presensi

import "dotenv/config";
import { PrismaClient, Role, JenjangSiswa } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (in order due to foreign keys)
  await prisma.absensiKerja.deleteMany();
  await prisma.laporanHarian.deleteMany();
  await prisma.absensiSiswa.deleteMany();
  await prisma.catatanMentorBulanan.deleteMany();
  await prisma.pembayaran.deleteMany();
  await prisma.jadwal.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin123!", 12);
  const mentorHash = await bcrypt.hash("Mentor123!", 12);

  // ===== USERS =====
  const admin = await prisma.user.create({
    data: {
      nama: "Admin Al Ruumi",
      email: "admin@bimbelalruumi.com",
      password: passwordHash,
      role: Role.ADMIN,
      noHp: "6285640817894",
    },
  });
  console.log(`  ✅ Admin: ${admin.email} / Admin123!`);

  const mentor1 = await prisma.user.create({
    data: {
      nama: "Ahmad Fauzi",
      email: "fauzi@bimbelalruumi.com",
      password: mentorHash,
      role: Role.MENTOR,
      noHp: "081234567001",
      alamat: "Jl. Merdeka No. 10",
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      nama: "Siti Aisyah",
      email: "aisyah@bimbelalruumi.com",
      password: mentorHash,
      role: Role.MENTOR,
      noHp: "081234567002",
      alamat: "Jl. Cendana No. 5",
    },
  });
  console.log(`  ✅ Mentor: fauzi@bimbelalruumi.com / Mentor123!`);
  console.log(`  ✅ Mentor: aisyah@bimbelalruumi.com / Mentor123!`);

  // ===== SISWA =====
  const siswa1 = await prisma.siswa.create({
    data: {
      namaLengkap: "Muhammad Adi",
      namaOrtu: "Bapak Rahmat",
      noHpOrtu: "081111222001",
      jenjang: JenjangSiswa.SMP,
      kelas: "8",
      sekolahAsal: "SMPN 1 Samarinda",
      alamatRumah: "Jl. Pahlawan No. 15",
      programBelajar: "Reguler",
    },
  });

  const siswa2 = await prisma.siswa.create({
    data: {
      namaLengkap: "Fatimah Zahra",
      namaOrtu: "Ibu Aminah",
      noHpOrtu: "081111222002",
      jenjang: JenjangSiswa.SMA,
      kelas: "11",
      sekolahAsal: "SMAN 1 Samarinda",
      alamatRumah: "Jl. Kartini No. 8",
      programBelajar: "Intensif",
    },
  });

  const siswa3 = await prisma.siswa.create({
    data: {
      namaLengkap: "Rizki Aditya",
      namaOrtu: "Bapak Hasan",
      noHpOrtu: "081111222003",
      jenjang: JenjangSiswa.SD,
      kelas: "6",
      sekolahAsal: "SDN 3 Samarinda",
      alamatRumah: "Jl. Diponegoro No. 20",
      programBelajar: "Reguler",
    },
  });

  const siswa4 = await prisma.siswa.create({
    data: {
      namaLengkap: "Nisa Aulia",
      namaOrtu: "Ibu Dewi",
      noHpOrtu: "081111222004",
      jenjang: JenjangSiswa.SMP,
      kelas: "9",
      sekolahAsal: "SMPN 5 Samarinda",
      alamatRumah: "Jl. Sudirman No. 12",
      programBelajar: "Intensif",
    },
  });

  const siswa5 = await prisma.siswa.create({
    data: {
      namaLengkap: "Akbar Maulana",
      namaOrtu: "Bapak Yusuf",
      noHpOrtu: "081111222005",
      jenjang: JenjangSiswa.SMA,
      kelas: "12",
      sekolahAsal: "SMAN 3 Samarinda",
      alamatRumah: "Jl. Ahmad Yani No. 7",
      programBelajar: "Intensif",
    },
  });
  console.log(`  ✅ 5 siswa berhasil ditambahkan`);

  // ===== JADWAL =====
  await prisma.jadwal.createMany({
    data: [
      {
        siswaId: siswa1.id,
        mentorId: mentor1.id,
        hariMengajar: ["Senin", "Rabu"],
        jamMulai: "14:00",
        jamSelesai: "15:30",
        mataPelajaran: ["Matematika", "IPA"],
        tanggalMulai: new Date("2026-01-01"),
      },
      {
        siswaId: siswa2.id,
        mentorId: mentor1.id,
        hariMengajar: ["Selasa", "Kamis"],
        jamMulai: "16:00",
        jamSelesai: "17:30",
        mataPelajaran: ["Fisika", "Kimia"],
        tanggalMulai: new Date("2026-01-01"),
      },
      {
        siswaId: siswa3.id,
        mentorId: mentor2.id,
        hariMengajar: ["Senin", "Rabu", "Jumat"],
        jamMulai: "13:00",
        jamSelesai: "14:00",
        mataPelajaran: ["Matematika", "B. Indonesia"],
        tanggalMulai: new Date("2026-01-01"),
      },
      {
        siswaId: siswa4.id,
        mentorId: mentor2.id,
        hariMengajar: ["Selasa", "Sabtu"],
        jamMulai: "15:00",
        jamSelesai: "16:30",
        mataPelajaran: ["B. Inggris", "Matematika"],
        tanggalMulai: new Date("2026-01-01"),
      },
      {
        siswaId: siswa5.id,
        mentorId: mentor1.id,
        hariMengajar: ["Jumat", "Sabtu"],
        jamMulai: "09:00",
        jamSelesai: "10:30",
        mataPelajaran: ["Matematika", "Fisika", "Kimia"],
        tanggalMulai: new Date("2026-01-01"),
      },
    ],
  });
  console.log(`  ✅ Jadwal berhasil ditambahkan`);

  // ===== PRESENSI CONTOH =====
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.absensiKerja.createMany({
    data: [
      { userId: mentor1.id, tanggal: today, jamMasuk: "14:00", durasiMenit: 90, catatan: "Les Matematika - Muhammad Adi" },
      { userId: mentor1.id, tanggal: today, jamMasuk: "16:00", durasiMenit: 90, catatan: "Les Fisika - Fatimah Zahra" },
      { userId: mentor1.id, tanggal: yesterday, jamMasuk: "09:00", durasiMenit: 120, catatan: "Les Intensif - Akbar Maulana" },
      { userId: mentor2.id, tanggal: today, jamMasuk: "13:00", durasiMenit: 60, catatan: "Les Matematika - Rizki Aditya" },
    ],
  });
  console.log(`  ✅ Presensi contoh ditambahkan`);

  console.log("\n🎉 Seeding selesai!");
  console.log("\n📋 Akun Login:");
  console.log("   Admin:  admin@bimbelalruumi.com / Admin123!");
  console.log("   Mentor: fauzi@bimbelalruumi.com / Mentor123!");
  console.log("   Mentor: aisyah@bimbelalruumi.com / Mentor123!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
