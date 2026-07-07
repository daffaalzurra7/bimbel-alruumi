"use client";

import {
  Shield, Star, BarChart3, Users, Clock,
  HeartHandshake, BookMarked, Sparkles,
  Award, GraduationCap, FileText,
} from "lucide-react";

// Icon lookup map
const iconMap: Record<string, React.ElementType> = {
  Shield, Star, BarChart3, Users, Clock,
  HeartHandshake, BookMarked, Sparkles,
  Award, GraduationCap, FileText,
};

interface KeunggulanItem {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const DEFAULT_ITEMS: KeunggulanItem[] = [
  { icon: "Users", title: "Mentor Pilihan & Terlatih", description: "Semua mentor melewati proses seleksi ketat dan pelatihan berkala untuk memastikan kualitas pengajaran terbaik.", gradient: "linear-gradient(135deg, #0d9255, #065f36)" },
  { icon: "BookMarked", title: "Kurikulum Terkini", description: "Materi pembelajaran selalu diperbarui mengikuti kurikulum terbaru dan dilengkapi bank soal yang komprehensif.", gradient: "linear-gradient(135deg, #087542, #053f24)" },
  { icon: "BarChart3", title: "Laporan Perkembangan", description: "Orang tua mendapat laporan harian tentang perkembangan belajar anak, lengkap dengan evaluasi dan rekomendasi.", gradient: "linear-gradient(135deg, #d4930c, #8e5c0a)" },
  { icon: "Shield", title: "Pendekatan Islami", description: "Setiap sesi belajar diawali dan diakhiri dengan doa, serta menanamkan adab dan akhlak mulia kepada siswa.", gradient: "linear-gradient(135deg, #0d9255, #022c19)" },
  { icon: "Clock", title: "Jadwal Fleksibel", description: "Waktu belajar dapat disesuaikan dengan jadwal sekolah dan aktivitas siswa untuk kenyamanan maksimal.", gradient: "linear-gradient(135deg, #087542, #065f36)" },
  { icon: "HeartHandshake", title: "Les Privat ke Rumah", description: "Mentor datang langsung ke rumah siswa, menciptakan suasana belajar yang nyaman dan personal.", gradient: "linear-gradient(135deg, #b57a08, #643d13)" },
  { icon: "Star", title: "Garansi Peningkatan", description: "Kami berkomitmen pada peningkatan nilai siswa. Jika tidak ada kemajuan, kami evaluasi dan sesuaikan strategi pembelajaran.", gradient: "linear-gradient(135deg, #0d9255, #087542)" },
];

const DEFAULTS = {
  section_badge: "Mengapa Kami",
  section_title: "7 Keunggulan Al Ruumi",
  section_title_highlight: "Al Ruumi",
  section_subtitle: "Alasan mengapa ratusan orang tua mempercayakan pendidikan putra-putrinya kepada kami",
  items: DEFAULT_ITEMS,
};

interface KeunggulanProps {
  content?: Record<string, unknown>;
}

export default function KeunggulanSection({ content = {} }: KeunggulanProps) {
  const get = (key: string) => (content[key] !== undefined ? content[key] : DEFAULTS[key as keyof typeof DEFAULTS]);

  const items = (get("items") || DEFAULT_ITEMS) as KeunggulanItem[];
  const sectionTitle = String(get("section_title"));
  const highlight = String(get("section_title_highlight"));

  // Split title around highlight
  const parts = sectionTitle.split(highlight);
  const before = parts[0]?.trim() || "";
  const after = parts[1]?.trim() || "";

  return (
    <section
      id="keunggulan"
      className="section"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge">
            <Sparkles size={14} />
            {String(get("section_badge"))}
          </div>
          <h2 className="section-title">
            {before}{" "}
            <span
              className="gold-underline"
              style={{ color: "var(--color-primary-600)" }}
            >
              {highlight}
            </span>
            {after && ` ${after}`}
          </h2>
          <p className="section-subtitle">
            {String(get("section_subtitle"))}
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {items.map((item, index) => {
            const IconComp = iconMap[item.icon] || Star;
            return (
              <div
                key={index}
                className="card"
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                  border: "none",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: item.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  }}
                >
                  <IconComp size={22} color="white" />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.375rem",
                      fontFamily: "var(--font-outfit), sans-serif",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8375rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
