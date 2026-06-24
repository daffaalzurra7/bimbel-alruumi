"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, BookOpen, MapPin } from "lucide-react";

interface Siswa {
  id: string;
  namaLengkap: string;
  jenjang: string;
  kelas: string;
  sekolahAsal: string | null;
  noHpOrtu: string;
  namaOrtu: string;
  programBelajar: string;
  jadwal: {
    hariMengajar: string[];
    jamMulai: string;
    jamSelesai: string;
    mataPelajaran: string[];
  }[];
}

export default function SiswaSayaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const res = await fetch("/api/siswa?mine=true");
        if (res.ok) {
          const data = await res.json();
          setSiswaList(data.data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSiswa();
  }, []);

  const jenjangColor: Record<string, { bg: string; text: string }> = {
    SD: { bg: "#dbeafe", text: "#1d4ed8" },
    SMP: { bg: "#ede9fe", text: "#6d28d9" },
    SMA: { bg: "#fce7f3", text: "#be185d" },
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-outfit), sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Users size={24} style={{ color: "var(--color-primary-500)" }} />
          Siswa Saya
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Daftar siswa yang Anda ajar berdasarkan jadwal aktif.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Memuat data siswa...
        </div>
      ) : siswaList.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "3rem",
            textAlign: "center",
            border: "1px solid var(--color-neutral-100)",
          }}
        >
          <GraduationCap size={48} style={{ color: "var(--color-neutral-300)", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-secondary)" }}>Belum ada siswa yang diassign ke Anda.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}
        >
          {siswaList.map((siswa) => (
            <div
              key={siswa.id}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                border: "1px solid var(--color-neutral-100)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 600 }}>{siswa.namaLengkap}</h3>
                <span
                  style={{
                    padding: "0.25rem 0.625rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: jenjangColor[siswa.jenjang]?.bg || "#f1f5f9",
                    color: jenjangColor[siswa.jenjang]?.text || "#475569",
                  }}
                >
                  {siswa.jenjang} - Kelas {siswa.kelas}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                {siswa.sekolahAsal && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <MapPin size={14} />
                    {siswa.sekolahAsal}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <BookOpen size={14} />
                  {siswa.programBelajar}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Users size={14} />
                  {siswa.namaOrtu} — {siswa.noHpOrtu}
                </div>
              </div>

              {siswa.jadwal.length > 0 && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "var(--bg-secondary)",
                    borderRadius: "10px",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Jadwal
                  </div>
                  {siswa.jadwal.map((j, i) => (
                    <div key={i} style={{ fontSize: "0.8125rem", color: "var(--text-primary)" }}>
                      {j.hariMengajar.join(", ")} • {j.jamMulai}—{j.jamSelesai} • {j.mataPelajaran.join(", ")}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
