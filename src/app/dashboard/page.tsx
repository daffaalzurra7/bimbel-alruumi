"use client";

import { useSession } from "next-auth/react";
import {
  ClipboardCheck,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function DashboardHome() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role || "MENTOR";

  const mentorStats = [
    { label: "Presensi Bulan Ini", value: "—", icon: ClipboardCheck, color: "var(--color-primary-500)" },
    { label: "Siswa Aktif", value: "—", icon: Users, color: "var(--color-gold-500)" },
    { label: "Laporan Bulan Ini", value: "—", icon: FileText, color: "#6366f1" },
    { label: "Total Jam Mengajar", value: "—", icon: TrendingUp, color: "#ec4899" },
  ];

  const adminStats = [
    { label: "Total Mentor", value: "—", icon: Users, color: "var(--color-primary-500)" },
    { label: "Total Siswa", value: "—", icon: Users, color: "var(--color-gold-500)" },
    { label: "Pembayaran Pending", value: "—", icon: ClipboardCheck, color: "#f59e0b" },
    { label: "Laporan Hari Ini", value: "—", icon: FileText, color: "#6366f1" },
  ];

  const stats = role === "ADMIN" ? adminStats : mentorStats;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-outfit), sans-serif",
            marginBottom: "0.25rem",
          }}
        >
          Assalamualaikum, {session?.user?.name || "User"} 👋
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {role === "ADMIN"
            ? "Kelola mentor, siswa, dan operasional bimbel dari sini."
            : "Pantau jadwal, isi presensi, dan buat laporan harian Anda."}
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1px solid var(--color-neutral-100)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: `${stat.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))",
          border: "1px solid var(--color-primary-200)",
          borderRadius: "16px",
          padding: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--color-primary-800)",
            marginBottom: "0.5rem",
          }}
        >
          💡 Tips
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--color-primary-700)", lineHeight: 1.7 }}>
          {role === "ADMIN"
            ? "Gunakan menu di sidebar untuk mengelola data mentor, siswa, jadwal, dan pembayaran. Semua data tersimpan secara real-time."
            : "Jangan lupa isi presensi dan laporan harian setiap selesai mengajar. Data ini penting untuk evaluasi dan pencatatan."}
        </p>
      </div>
    </div>
  );
}
