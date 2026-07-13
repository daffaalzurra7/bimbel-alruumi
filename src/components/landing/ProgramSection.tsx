"use client";

import { MessageCircle, BookOpen, Calculator, Atom, Languages, GraduationCap, PenTool, Target, Trophy, Star, Award, Sparkles, FileText } from "lucide-react";

// Icon lookup map for dynamic icon rendering
const iconMap: Record<string, React.ElementType> = {
  BookOpen, Calculator, Atom, Languages, GraduationCap, PenTool, Target, Trophy,
  Star, Award, Sparkles, FileText, MessageCircle,
};

interface ProgramItem {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  subjects: string[];
  color: string;
  colorLight: string;
  waMessage: string;
}

const DEFAULT_PROGRAMS: ProgramItem[] = [
  { title: "Program Sukses SD", subtitle: "Kelas 1–6 SD", description: "Fondasi belajar yang kuat sejak dini. Fokus pada pemahaman konsep dasar Matematika, Bahasa Indonesia, IPA, dan pembentukan kebiasaan belajar yang baik.", icon: "BookOpen", subjects: ["Matematika", "B. Indonesia", "IPA", "B. Inggris"], color: "#0d9255", colorLight: "#ecfdf5", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program Sukses SD di Bimbel Al Ruumi." },
  { title: "TKA SD", subtitle: "Tes Kemampuan Akademik SD", description: "TKA adalah ujian yang nilainya akan menggantikan fungsi nilai rapor pada jalur prestasi SPMB untuk masuk sekolah pada jenjang berikutnya. Persiapan khusus latihan soal TKA, logika dasar, dan kemampuan verbal-numerik.", icon: "PenTool", subjects: ["Logika Dasar", "Numerik", "Verbal", "Penalaran"], color: "#059669", colorLight: "#d1fae5", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program TKA SD di Bimbel Al Ruumi." },
  { title: "Program Sukses SMP", subtitle: "Kelas 7–9 SMP", description: "Persiapan matang untuk menghadapi ujian dan melanjutkan ke SMA favorit. Pendalaman materi dan latihan soal intensif dengan pendampingan personal.", icon: "Calculator", subjects: ["Matematika", "IPA", "B. Indonesia", "B. Inggris"], color: "#087542", colorLight: "#d1fae5", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program Sukses SMP di Bimbel Al Ruumi." },
  { title: "TKA SMP", subtitle: "Tes Kemampuan Akademik SMP", description: "TKA adalah ujian yang nilainya akan menggantikan fungsi nilai rapor pada jalur prestasi SPMB untuk masuk sekolah pada jenjang berikutnya. Bimbingan intensif penguatan kemampuan penalaran, matematika, dan verbal sesuai standar seleksi.", icon: "Target", subjects: ["Penalaran Umum", "Matematika", "B. Indonesia", "IPA"], color: "#0369a1", colorLight: "#e0f2fe", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program TKA SMP di Bimbel Al Ruumi." },
  { title: "Program Sukses SMA", subtitle: "Kelas 10–12 SMA", description: "Program intensif untuk penguasaan materi SMA. Strategi belajar efektif dan pendampingan akademik menyeluruh untuk meraih prestasi optimal.", icon: "Atom", subjects: ["Matematika", "Fisika", "Kimia", "Biologi", "B. Inggris"], color: "#065f36", colorLight: "#a7f3d0", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program Sukses SMA di Bimbel Al Ruumi." },
  { title: "UTBK SMA", subtitle: "Persiapan UTBK / SNBT", description: "Program unggulan persiapan UTBK-SNBT masuk PTN impian. Try out berkala, pembahasan soal HOTS, strategi pengerjaan, dan bimbingan pemilihan jurusan.", icon: "Trophy", subjects: ["Penalaran Umum", "Penalaran Matematika", "Literasi B. Indonesia", "Literasi B. Inggris"], color: "#7c3aed", colorLight: "#ede9fe", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program UTBK SMA di Bimbel Al Ruumi." },
  { title: "Program TKA Islami", subtitle: "Tahsin & Tahfidz", description: "Program khusus bimbingan baca Al-Quran, tahsin, dan tahfidz. Dilengkapi dengan pembelajaran adab dan akhlak Islami sehari-hari.", icon: "Languages", subjects: ["Tahsin", "Tahfidz"], color: "#d4930c", colorLight: "#fffbeb", waMessage: "Assalamualaikum, saya ingin mendaftarkan anak saya untuk Program TKA Islami di Bimbel Al Ruumi." },
];

const DEFAULTS = {
  section_badge: "Program Belajar",
  section_title: "Program Unggulan Kami",
  section_title_highlight: "Unggulan",
  section_subtitle: "Pilih program yang sesuai dengan kebutuhan dan jenjang pendidikan putra-putri Anda",
  programs: DEFAULT_PROGRAMS,
};

interface ProgramSectionProps {
  content?: Record<string, unknown>;
  waNumber?: string;
}

export default function ProgramSection({ content = {}, waNumber }: ProgramSectionProps) {
  const get = (key: string) => (content[key] !== undefined ? content[key] : DEFAULTS[key as keyof typeof DEFAULTS]);

  const programs = (get("programs") || DEFAULT_PROGRAMS) as ProgramItem[];
  const wa = waNumber || process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";

  const sectionTitle = String(get("section_title"));
  const highlight = String(get("section_title_highlight"));

  return (
    <section
      id="program"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge">
            <GraduationCap size={14} />
            {String(get("section_badge"))}
          </div>
          <h2 className="section-title">
            {sectionTitle.replace(highlight, "").trim()}{" "}
            <span className="gold-underline" style={{ color: "var(--color-primary-600)" }}>
              {highlight}
            </span>{" "}
            {sectionTitle.split(highlight)[1]?.trim() || ""}
          </h2>
          <p className="section-subtitle">
            {String(get("section_subtitle"))}
          </p>
        </div>

        {/* Program Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {programs.map((program, index) => {
            const IconComp = iconMap[program.icon] || BookOpen;
            return (
              <div
                key={index}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${program.color}, ${program.color}88)`,
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: program.colorLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <IconComp size={24} style={{ color: program.color }} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  {program.title}
                </h3>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: program.color,
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                  }}
                >
                  {program.subtitle}
                </span>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                    flex: 1,
                  }}
                >
                  {program.description}
                </p>

                {/* Subjects */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.375rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {(program.subjects || []).map((subject, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "6px",
                        background: program.colorLight,
                        color: program.color,
                        fontWeight: 500,
                      }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(program.waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${program.color}, ${program.color}dd)`,
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 14px ${program.color}35`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 6px 20px ${program.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 4px 14px ${program.color}35`;
                  }}
                >
                  <MessageCircle size={16} />
                  Daftar Program Ini
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
