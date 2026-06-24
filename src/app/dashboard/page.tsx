"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ClipboardCheck, Users, FileText, TrendingUp,
  CreditCard, Clock,
} from "lucide-react";

interface AdminStats {
  totalMentor: number;
  totalSiswa: number;
  pembayaranPending: number;
  laporanHariIni: number;
  presensiHariIni: number;
}

interface MentorStats {
  presensiBulanIni: number;
  siswaAktif: number;
  laporanBulanIni: number;
  totalJam: number;
}

export default function DashboardHome() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role || "MENTOR";
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [mentorStats, setMentorStats] = useState<MentorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const d = await res.json();
          if (role === "ADMIN") setAdminStats(d.data);
          else setMentorStats(d.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (session) fetchStats();
  }, [session, role]);

  const adminCards = adminStats ? [
    { label: "Total Mentor", value: adminStats.totalMentor, icon: Users, color: "var(--color-primary-500)" },
    { label: "Total Siswa", value: adminStats.totalSiswa, icon: Users, color: "var(--color-gold-500)" },
    { label: "Pembayaran Pending", value: adminStats.pembayaranPending, icon: CreditCard, color: "#f59e0b" },
    { label: "Laporan Hari Ini", value: adminStats.laporanHariIni, icon: FileText, color: "#6366f1" },
    { label: "Presensi Hari Ini", value: adminStats.presensiHariIni, icon: ClipboardCheck, color: "#ec4899" },
  ] : [];

  const mentorCards = mentorStats ? [
    { label: "Presensi Bulan Ini", value: mentorStats.presensiBulanIni, icon: ClipboardCheck, color: "var(--color-primary-500)" },
    { label: "Siswa Aktif", value: mentorStats.siswaAktif, icon: Users, color: "var(--color-gold-500)" },
    { label: "Laporan Bulan Ini", value: mentorStats.laporanBulanIni, icon: FileText, color: "#6366f1" },
    { label: "Total Jam Mengajar", value: `${mentorStats.totalJam}j`, icon: Clock, color: "#ec4899" },
  ] : [];

  const stats = role === "ADMIN" ? adminCards : mentorCards;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-outfit), sans-serif", marginBottom: "0.25rem" }}>
          Assalamualaikum, {session?.user?.name || "User"} 👋
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {role === "ADMIN"
            ? "Kelola mentor, siswa, dan operasional bimbel dari sini."
            : "Pantau jadwal, isi presensi, dan buat laporan harian Anda."}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--color-neutral-100)", animation: "pulse 1.5s ease infinite" }} />
              <div>
                <div style={{ width: "48px", height: "24px", borderRadius: "6px", background: "var(--color-neutral-100)", animation: "pulse 1.5s ease infinite", marginBottom: "0.375rem" }} />
                <div style={{ width: "80px", height: "14px", borderRadius: "4px", background: "var(--color-neutral-100)", animation: "pulse 1.5s ease infinite" }} />
              </div>
            </div>
          ))
        ) : stats.map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-outfit), sans-serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div style={{ background: "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))", border: "1px solid var(--color-primary-200)", borderRadius: "16px", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-primary-800)", marginBottom: "0.5rem" }}>💡 Tips</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--color-primary-700)", lineHeight: 1.7 }}>
          {role === "ADMIN"
            ? "Gunakan menu di sidebar untuk mengelola data mentor, siswa, jadwal, dan pembayaran. Semua data tersimpan secara real-time."
            : "Jangan lupa isi presensi dan laporan harian setiap selesai mengajar. Data ini penting untuk evaluasi dan pencatatan."}
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
