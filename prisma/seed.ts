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
  await prisma.bonusMentor.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.siteContent.deleteMany();
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

  // ===== CMS — LANDING PAGE CONTENT =====
  const cmsData = [
    // --- HERO ---
    { section: "hero", key: "badge_text", value: "Bimbingan Belajar dengan Nilai Islami" },
    { section: "hero", key: "headline", value: "Bimbing Masa Depan Cemerlang Putra-Putri Anda" },
    { section: "hero", key: "headline_highlight", value: "Cemerlang" },
    { section: "hero", key: "subheadline", value: "Bimbel Al Ruumi hadir dengan metode pembelajaran yang efektif, mentor berakhlak mulia, dan pendekatan Islami yang membentuk akhlakul karimah serta cemerlang dalam pembelajaran." },
    { section: "hero", key: "wa_number", value: "6285640817894" },
    { section: "hero", key: "wa_message", value: "Assalamualaikum, saya ingin mendaftarkan anak saya di Bimbel Al Ruumi. Mohon informasi lebih lanjut." },
    { section: "hero", key: "cta_primary", value: "Daftar via WhatsApp" },
    { section: "hero", key: "cta_secondary", value: "Lihat Program" },
    {
      section: "hero", key: "stats", value: [
        { icon: "Users", value: "500+", label: "Siswa Aktif" },
        { icon: "Award", value: "50+", label: "Mentor Profesional" },
        { icon: "Clock", value: "5+", label: "Tahun Berpengalaman" },
      ],
    },

    // --- VISI MISI ---
    { section: "visi_misi", key: "section_badge", value: "Landasan Kami" },
    { section: "visi_misi", key: "section_title", value: "Visi & Misi" },
    { section: "visi_misi", key: "section_title_highlight", value: "Misi" },
    { section: "visi_misi", key: "section_subtitle", value: "Membangun generasi yang unggul dalam ilmu pengetahuan dan berkarakter Islami" },
    { section: "visi_misi", key: "visi_text", value: "Menjadi lembaga bimbingan belajar terdepan yang menghasilkan generasi berprestasi akademik tinggi, berkarakter mulia, dan berakhlak Islami. Kami berkomitmen mencetak siswa yang siap menghadapi tantangan masa depan dengan bekal ilmu dan iman." },
    {
      section: "visi_misi", key: "misi_items", value: [
        "Menyediakan mentor berkualitas & berdedikasi",
        "Menerapkan kurikulum yang efektif & terkini",
        "Membangun karakter Islami pada setiap siswa",
        "Memberikan laporan perkembangan transparan",
        "Menjadi mitra terpercaya bagi orang tua",
      ],
    },

    // --- PROGRAM ---
    { section: "program", key: "section_badge", value: "Program Belajar" },
    { section: "program", key: "section_title", value: "Program Unggulan Kami" },
    { section: "program", key: "section_title_highlight", value: "Unggulan" },
    { section: "program", key: "section_subtitle", value: "Pilih program yang sesuai dengan kebutuhan dan jenjang pendidikan putra-putri Anda" },
    {
      section: "program", key: "programs", value: [
        {
          title: "Program Sukses SD", subtitle: "Kelas 1–6 SD",
          description: "Fondasi belajar yang kuat sejak dini. Fokus pada pemahaman konsep dasar Matematika, Bahasa Indonesia, IPA, dan pembentukan kebiasaan belajar yang baik.",
          icon: "BookOpen", subjects: ["Matematika", "B. Indonesia", "IPA", "B. Inggris"],
          color: "#0d9255", colorLight: "#ecfdf5",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program Sukses SD di Bimbel Al Ruumi.",
        },
        {
          title: "TKA SD", subtitle: "Tes Kemampuan Akademik SD",
          description: "Persiapan khusus tes masuk SD unggulan dan sekolah favorit. Latihan soal TKA, logika dasar, dan kemampuan verbal-numerik untuk anak usia dini.",
          icon: "PenTool", subjects: ["Logika Dasar", "Numerik", "Verbal", "Penalaran"],
          color: "#059669", colorLight: "#d1fae5",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program TKA SD di Bimbel Al Ruumi.",
        },
        {
          title: "Program Sukses SMP", subtitle: "Kelas 7–9 SMP",
          description: "Persiapan matang untuk menghadapi ujian dan melanjutkan ke SMA favorit. Pendalaman materi dan latihan soal intensif dengan pendampingan personal.",
          icon: "Calculator", subjects: ["Matematika", "IPA", "B. Indonesia", "B. Inggris"],
          color: "#087542", colorLight: "#d1fae5",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program Sukses SMP di Bimbel Al Ruumi.",
        },
        {
          title: "TKA SMP", subtitle: "Tes Kemampuan Akademik SMP",
          description: "Bimbingan intensif persiapan tes masuk SMP unggulan/negeri. Penguatan kemampuan penalaran, matematika, dan verbal sesuai standar seleksi.",
          icon: "Target", subjects: ["Penalaran Umum", "Matematika", "B. Indonesia", "IPA"],
          color: "#0369a1", colorLight: "#e0f2fe",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program TKA SMP di Bimbel Al Ruumi.",
        },
        {
          title: "Program Sukses SMA", subtitle: "Kelas 10–12 SMA",
          description: "Program intensif untuk penguasaan materi SMA. Strategi belajar efektif dan pendampingan akademik menyeluruh untuk meraih prestasi optimal.",
          icon: "Atom", subjects: ["Matematika", "Fisika", "Kimia", "Biologi", "B. Inggris"],
          color: "#065f36", colorLight: "#a7f3d0",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program Sukses SMA di Bimbel Al Ruumi.",
        },
        {
          title: "UTBK SMA", subtitle: "Persiapan UTBK / SNBT",
          description: "Program unggulan persiapan UTBK-SNBT masuk PTN impian. Try out berkala, pembahasan soal HOTS, strategi pengerjaan, dan bimbingan pemilihan jurusan.",
          icon: "Trophy", subjects: ["Penalaran Umum", "Penalaran Matematika", "Literasi B. Indonesia", "Literasi B. Inggris"],
          color: "#7c3aed", colorLight: "#ede9fe",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program UTBK SMA di Bimbel Al Ruumi.",
        },
        {
          title: "Program TKA Islami", subtitle: "Tahsin & Tahfidz",
          description: "Program khusus bimbingan baca Al-Quran, tahsin, dan tahfidz. Dilengkapi dengan pembelajaran adab dan akhlak Islami sehari-hari.",
          icon: "Languages", subjects: ["Tahsin", "Tahfidz", "Fiqih Dasar", "Adab Islami"],
          color: "#d4930c", colorLight: "#fffbeb",
          waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program TKA Islami di Bimbel Al Ruumi.",
        },
      ],
    },

    // --- KEUNGGULAN ---
    { section: "keunggulan", key: "section_badge", value: "Mengapa Kami" },
    { section: "keunggulan", key: "section_title", value: "7 Keunggulan Al Ruumi" },
    { section: "keunggulan", key: "section_title_highlight", value: "Al Ruumi" },
    { section: "keunggulan", key: "section_subtitle", value: "Alasan mengapa ratusan orang tua mempercayakan pendidikan putra-putrinya kepada kami" },
    {
      section: "keunggulan", key: "items", value: [
        { icon: "Users", title: "Mentor Pilihan & Terlatih", description: "Semua mentor melewati proses seleksi ketat dan pelatihan berkala untuk memastikan kualitas pengajaran terbaik.", gradient: "linear-gradient(135deg, #0d9255, #065f36)" },
        { icon: "BookMarked", title: "Kurikulum Terkini", description: "Materi pembelajaran selalu diperbarui mengikuti kurikulum terbaru dan dilengkapi bank soal yang komprehensif.", gradient: "linear-gradient(135deg, #087542, #053f24)" },
        { icon: "BarChart3", title: "Laporan Perkembangan", description: "Orang tua mendapat laporan harian tentang perkembangan belajar anak, lengkap dengan evaluasi dan rekomendasi.", gradient: "linear-gradient(135deg, #d4930c, #8e5c0a)" },
        { icon: "Shield", title: "Pendekatan Islami", description: "Setiap sesi belajar diawali dan diakhiri dengan doa, serta menanamkan adab dan akhlak mulia kepada siswa.", gradient: "linear-gradient(135deg, #0d9255, #022c19)" },
        { icon: "Clock", title: "Jadwal Fleksibel", description: "Waktu belajar dapat disesuaikan dengan jadwal sekolah dan aktivitas siswa untuk kenyamanan maksimal.", gradient: "linear-gradient(135deg, #087542, #065f36)" },
        { icon: "HeartHandshake", title: "Les Privat ke Rumah", description: "Mentor datang langsung ke rumah siswa, menciptakan suasana belajar yang nyaman dan personal.", gradient: "linear-gradient(135deg, #b57a08, #643d13)" },
        { icon: "Star", title: "Garansi Peningkatan", description: "Kami berkomitmen pada peningkatan nilai siswa. Jika tidak ada kemajuan, kami evaluasi dan sesuaikan strategi pembelajaran.", gradient: "linear-gradient(135deg, #0d9255, #087542)" },
      ],
    },

    // --- ATURAN ---
    { section: "aturan", key: "section_badge", value: "Ketentuan" },
    { section: "aturan", key: "section_title", value: "Aturan & Ketentuan" },
    { section: "aturan", key: "section_title_highlight", value: "Ketentuan" },
    { section: "aturan", key: "section_subtitle", value: "Aturan yang kami terapkan demi kelancaran dan kualitas proses belajar mengajar" },
    {
      section: "aturan", key: "items", value: [
        { title: "Ketentuan Pendaftaran", content: ["Pendaftaran dilakukan melalui WhatsApp atau datang langsung ke kantor Bimbel Al Ruumi.", "Orang tua/wali wajib mengisi formulir pendaftaran dengan data yang lengkap dan benar.", "Biaya pendaftaran dibayarkan saat proses registrasi selesai.", "Jadwal belajar disepakati bersama antara orang tua, siswa, dan pihak bimbel."] },
        { title: "Aturan Selama Belajar", content: ["Siswa wajib menyiapkan buku, alat tulis, dan materi yang akan dipelajari sebelum sesi dimulai.", "Setiap sesi belajar diawali dengan doa bersama dan diakhiri dengan evaluasi singkat.", "Siswa diharapkan mengerjakan tugas/pekerjaan rumah yang diberikan oleh mentor.", "Penggunaan handphone selama sesi belajar tidak diperkenankan, kecuali untuk keperluan belajar."] },
        { title: "Ketentuan Pembayaran", content: ["Pembayaran SPP dilakukan di awal bulan, paling lambat tanggal 10 setiap bulannya.", "Pembayaran dapat dilakukan via transfer bank atau cash ke kantor.", "Bukti pembayaran wajib dikirim melalui WhatsApp untuk verifikasi.", "Keterlambatan pembayaran lebih dari 15 hari akan dikenakan notifikasi pengingat."] },
        { title: "Kebijakan Izin & Penggantian Jadwal", content: ["Jika siswa berhalangan hadir, orang tua wajib menginformasikan minimal 3 jam sebelum jadwal.", "Penggantian jadwal dapat dilakukan maksimal 2 kali dalam sebulan.", "Ketidakhadiran tanpa pemberitahuan (alpa) tidak mendapat penggantian jadwal.", "Mentor yang berhalangan akan diganti oleh mentor pengganti yang setara."] },
        { title: "Hak & Kewajiban Orang Tua", content: ["Orang tua berhak mendapatkan laporan perkembangan belajar anak secara berkala.", "Orang tua berhak memberikan masukan dan evaluasi terhadap kinerja mentor.", "Orang tua wajib menyediakan tempat belajar yang kondusif di rumah.", "Komunikasi antara orang tua dan pihak bimbel dilakukan melalui WhatsApp resmi."] },
      ],
    },

    // --- FOOTER ---
    { section: "footer", key: "description", value: "Bimbel Al Ruumi hadir sebagai mitra terpercaya dalam membimbing putra-putri Anda belajar dengan landasan nilai Islami." },
    {
      section: "footer", key: "contact_info", value: [
        { icon: "MapPin", text: "Jl. Contoh Alamat No. 123, Bekasi, Jawa Barat" },
        { icon: "Phone", text: "+62 812-3456-7890" },
        { icon: "Mail", text: "info@bimbelalruumi.com" },
        { icon: "Clock", text: "Senin - Sabtu, 08:00 - 20:00 WIB" },
      ],
    },
    {
      section: "footer", key: "social_links", value: [
        { icon: "Globe", href: "#", label: "Instagram" },
        { icon: "Video", href: "#", label: "YouTube" },
      ],
    },
    { section: "footer", key: "map_embed_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.29600791963!2d106.82497!3d-6.2297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sBekasi!5e0!3m2!1sid!2sid!4v1" },
    { section: "footer", key: "copyright_extra", value: "Dibuat dengan ❤️ untuk pendidikan Indonesia" },
  ];

  for (const item of cmsData) {
    await prisma.siteContent.upsert({
      where: { section_key: { section: item.section, key: item.key } },
      update: { value: item.value as never },
      create: { section: item.section, key: item.key, value: item.value as never },
    });
  }
  console.log(`  ✅ CMS landing page content seeded (${cmsData.length} entries)`);

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
