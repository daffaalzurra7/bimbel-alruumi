"use client";

import { ArrowRight, MessageCircle, Users, Award, Clock, Star } from "lucide-react";

// Icon lookup map
const iconMap: Record<string, React.ElementType> = { Users, Award, Clock, Star };

// Default content — used when CMS data is not available
const DEFAULTS = {
  badge_text: "Bimbingan Belajar dengan Nilai Islami",
  headline: "Bimbing Masa Depan Cemerlang Putra-Putri Anda",
  headline_highlight: "Cemerlang",
  subheadline:
    "Bimbel Al Ruumi hadir dengan metode pembelajaran yang efektif, mentor berakhlak mulia, dan pendekatan Islami yang membentuk akhlakul karimah serta cemerlang dalam pembelajaran.",
  wa_number: "6285640817894",
  wa_message:
    "Assalamualaikum, saya ingin mendaftarkan anak saya di Bimbel Al Ruumi. Mohon informasi lebih lanjut.",
  cta_primary: "Daftar via WhatsApp",
  cta_secondary: "Lihat Program",
  stats: [
    { icon: "Users", value: "500+", label: "Siswa Aktif" },
    { icon: "Award", value: "50+", label: "Mentor Profesional" },
    { icon: "Clock", value: "5+", label: "Tahun Berpengalaman" },
  ],
};

interface HeroProps {
  content?: Record<string, unknown>;
}

export default function HeroSection({ content = {} }: HeroProps) {
  const get = (key: string) => (content[key] !== undefined ? content[key] : DEFAULTS[key as keyof typeof DEFAULTS]);

  const waNumber = String(get("wa_number"));
  const waMessage = String(get("wa_message"));
  const headline = String(get("headline"));
  const highlight = String(get("headline_highlight"));
  const stats = (get("stats") || []) as Array<{ icon: string; value: string; label: string }>;

  // Split headline around highlight word
  const highlightIndex = headline.indexOf(highlight);
  const beforeHighlight = highlightIndex >= 0 ? headline.substring(0, highlightIndex) : headline;
  const afterHighlight = highlightIndex >= 0 ? headline.substring(highlightIndex + highlight.length) : "";

  return (
    <section
      id="beranda"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}
      className="gradient-hero"
    >
      {/* Islamic Pattern Overlay */}
      <div className="islamic-pattern" />

      {/* Gradient Overlay */}
      <div className="gradient-hero-overlay" style={{ position: "absolute", inset: 0 }} />

      {/* Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249, 188, 36, 0.08) 0%, transparent 70%)",
        }}
        className="animate-float"
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "3%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13, 146, 85, 0.12) 0%, transparent 70%)",
        }}
        className="animate-float"
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "8rem 1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1.25rem",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.15)",
            marginBottom: "2rem",
            color: "rgba(255,255,255,0.9)",
            fontSize: "0.8125rem",
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: "1rem" }}>🕌</span>
          {String(get("badge_text"))}
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            maxWidth: "800px",
            marginBottom: "1.5rem",
            animationDelay: "0.1s",
          }}
        >
          {beforeHighlight}
          {highlightIndex >= 0 && (
            <span
              style={{
                background: "linear-gradient(135deg, #fcd34d, #f9bc24, #d4930c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {highlight}
            </span>
          )}
          {afterHighlight && ` ${afterHighlight.trim()}`}
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-in-up"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255,255,255,0.75)",
            maxWidth: "620px",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            animationDelay: "0.2s",
          }}
        >
          {String(get("subheadline"))}
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-in-up"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "4rem",
            animationDelay: "0.3s",
          }}
        >
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
            style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}
          >
            <MessageCircle size={20} />
            {String(get("cta_primary"))}
          </a>
          <a
            href="#program"
            className="btn btn-outline"
            style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}
          >
            {String(get("cta_secondary"))}
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Stats Bar */}
        <div
          className="animate-fade-in-up"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "20px",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            animationDelay: "0.4s",
          }}
        >
          {stats.map((stat, index) => {
            const IconComp = iconMap[stat.icon] || Users;
            return (
              <div
                key={index}
                style={{
                  flex: "1 1 160px",
                  padding: "1.5rem 2.5rem",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <IconComp
                  size={24}
                  style={{ color: "#fcd34d", marginBottom: "0.25rem" }}
                />
                <span
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "white",
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Wave */}
      <div
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          lineHeight: 0,
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 73.3C480 67 600 73 720 80C840 87 960 93 1080 90C1200 87 1320 73 1380 66.7L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
