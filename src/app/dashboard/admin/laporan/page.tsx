"use client";

import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

interface Presensi {
  id: string;
  tanggal: string;
  jamMasuk: string;
  durasiMenit: number;
  catatan: string | null;
  user: { nama: string };
}

interface Laporan {
  id: string;
  tanggal: string;
  materiDipelajari: string;
  perkembangan: string;
  nilaiTO: number | null;
  siswa: { namaLengkap: string };
  mentor: { nama: string };
}

interface Mentor { id: string; nama: string; }

export default function AdminLaporanPage() {
  const [tab, setTab] = useState<"presensi" | "laporan">("presensi");
  const [presensiList, setPresensiList] = useState<Presensi[]>([]);
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorFilter, setMentorFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      const res = await fetch("/api/mentor");
      if (res.ok) { const d = await res.json(); setMentors(d.data || []); }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mentorParam = mentorFilter ? `?mentorId=${mentorFilter}` : "";
        if (tab === "presensi") {
          const res = await fetch(`/api/presensi${mentorParam}`);
          if (res.ok) { const d = await res.json(); setPresensiList(d.data || []); }
        } else {
          const res = await fetch(`/api/laporan${mentorParam}`);
          if (res.ok) { const d = await res.json(); setLaporanList(d.data || []); }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [tab, mentorFilter]);

  const tabStyle = (active: boolean) => ({
    padding: "0.625rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: active ? 700 : 500,
    color: active ? "var(--color-primary-700)" : "var(--text-secondary)",
    background: active ? "var(--color-primary-50)" : "transparent",
    border: `2px solid ${active ? "var(--color-primary-500)" : "var(--color-neutral-200)"}`,
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BarChart3 size={24} style={{ color: "var(--color-primary-500)" }} /> Laporan & Presensi
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Lihat data presensi dan laporan harian dari semua mentor.
        </p>
      </div>

      {/* Tabs + Filter */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setTab("presensi")} style={tabStyle(tab === "presensi")}>Presensi Kerja</button>
        <button onClick={() => setTab("laporan")} style={tabStyle(tab === "laporan")}>Laporan Harian</button>
        <div style={{ marginLeft: "auto" }}>
          <select
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
            style={{ padding: "0.625rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "10px", fontSize: "0.875rem", background: "white", outline: "none" }}
          >
            <option value="">Semua Mentor</option>
            {mentors.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : tab === "presensi" ? (
          presensiList.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada data presensi.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    {["Mentor", "Tanggal", "Hari", "Jam Masuk", "Durasi", "Catatan"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {presensiList.map((p) => {
                    const d = new Date(p.tanggal);
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                        <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{p.user?.nama}</td>
                        <td style={{ padding: "0.875rem 1rem" }}>{d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td style={{ padding: "0.875rem 1rem", color: "var(--text-secondary)" }}>{d.toLocaleDateString("id-ID", { weekday: "long" })}</td>
                        <td style={{ padding: "0.875rem 1rem" }}><span style={{ padding: "0.25rem 0.625rem", background: "var(--color-primary-50)", color: "var(--color-primary-700)", borderRadius: "6px", fontWeight: 600, fontSize: "0.8125rem" }}>{p.jamMasuk}</span></td>
                        <td style={{ padding: "0.875rem 1rem" }}><span style={{ padding: "0.25rem 0.625rem", background: "var(--color-gold-50)", color: "var(--color-gold-700)", borderRadius: "6px", fontWeight: 600, fontSize: "0.8125rem" }}>{p.durasiMenit} mnt</span></td>
                        <td style={{ padding: "0.875rem 1rem", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.catatan || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          laporanList.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada data laporan.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)" }}>
                    {["Mentor", "Siswa", "Tanggal", "Materi", "Perkembangan", "Nilai TO"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {laporanList.map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{l.mentor?.nama}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>{l.siswa?.namaLengkap}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>{new Date(l.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td style={{ padding: "0.875rem 1rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.materiDipelajari}</td>
                      <td style={{ padding: "0.875rem 1rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.perkembangan}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>{l.nilaiTO ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
