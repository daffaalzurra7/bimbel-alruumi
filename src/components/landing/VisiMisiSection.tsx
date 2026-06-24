"use client";

import { Eye, Target, Sparkles, Heart } from "lucide-react";

export default function VisiMisiSection() {
  return (
    <section id="visi-misi" className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge">
            <Sparkles size={14} />
            Landasan Kami
          </div>
          <h2 className="section-title">
            Visi &{" "}
            <span className="gold-underline" style={{ color: "var(--color-primary-600)" }}>
              Misi
            </span>
          </h2>
          <p className="section-subtitle">
            Membangun generasi yang unggul dalam ilmu pengetahuan dan berkarakter Islami
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Visi Card */}
          <div
            className="card"
            style={{
              position: "relative",
              overflow: "hidden",
              border: "none",
              background: "linear-gradient(135deg, var(--color-primary-50), white)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "var(--color-primary-100)",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                boxShadow: "var(--shadow-glow-green)",
              }}
            >
              <Eye size={26} color="white" />
            </div>
            <h3
              style={{
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--color-primary-800)",
                marginBottom: "1rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Visi Kami
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
                lineHeight: 1.8,
              }}
            >
              Menjadi lembaga bimbingan belajar terdepan yang menghasilkan generasi 
              berprestasi akademik tinggi, berkarakter mulia, dan berakhlak Islami. 
              Kami berkomitmen mencetak siswa yang siap menghadapi tantangan masa depan 
              dengan bekal ilmu dan iman.
            </p>
          </div>

          {/* Misi Card */}
          <div
            className="card"
            style={{
              position: "relative",
              overflow: "hidden",
              border: "none",
              background: "linear-gradient(135deg, var(--color-gold-50), white)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "var(--color-gold-100)",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                boxShadow: "var(--shadow-glow-gold)",
              }}
            >
              <Target size={26} color="#3a1f06" />
            </div>
            <h3
              style={{
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--color-gold-800)",
                marginBottom: "1rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Misi Kami
            </h3>
            <ul
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9375rem",
                lineHeight: 2,
                listStyle: "none",
                padding: 0,
              }}
            >
              {[
                "Menyediakan mentor berkualitas & berdedikasi",
                "Menerapkan kurikulum yang efektif & terkini",
                "Membangun karakter Islami pada setiap siswa",
                "Memberikan laporan perkembangan transparan",
                "Menjadi mitra terpercaya bagi orang tua",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <Heart
                    size={14}
                    style={{
                      color: "var(--color-gold-500)",
                      marginTop: "6px",
                      flexShrink: 0,
                    }}
                    fill="var(--color-gold-500)"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
