"use client";

import { useState, useEffect } from "react";
import { FileText, Save, Loader2, CheckCircle2, Trash2 } from "lucide-react";

interface SiswaOption {
  id: string;
  namaLengkap: string;
}

interface Laporan {
  id: string;
  tanggal: string;
  materiDipelajari: string;
  perkembangan: string;
  nilaiTO: number | null;
  catatanKhusus: string | null;
  siswa: { namaLengkap: string };
}

export default function LaporanPage() {
  const [siswaList, setSiswaList] = useState<SiswaOption[]>([]);
  const [riwayat, setRiwayat] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [siswaId, setSiswaId] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [materi, setMateri] = useState("");
  const [perkembangan, setPerkembangan] = useState("");
  const [nilaiTO, setNilaiTO] = useState("");
  const [catatan, setCatatan] = useState("");

  const fetchData = async () => {
    try {
      const [siswaRes, laporanRes] = await Promise.all([
        fetch("/api/siswa?mine=true"),
        fetch("/api/laporan"),
      ]);
      if (siswaRes.ok) {
        const d = await siswaRes.json();
        setSiswaList(d.data || []);
      }
      if (laporanRes.ok) {
        const d = await laporanRes.json();
        setRiwayat(d.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siswaId,
          tanggal,
          materiDipelajari: materi,
          perkembangan,
          nilaiTO: nilaiTO ? parseFloat(nilaiTO) : null,
          catatanKhusus: catatan || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error?.message || "Gagal menyimpan");
        return;
      }

      setSuccess(true);
      setMateri("");
      setPerkembangan("");
      setNilaiTO("");
      setCatatan("");
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus laporan ini?")) return;
    try {
      await fetch(`/api/laporan/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid var(--color-neutral-200)",
    borderRadius: "12px",
    fontSize: "0.9375rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600 as const,
    color: "var(--text-primary)",
    marginBottom: "0.5rem",
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={24} style={{ color: "var(--color-primary-500)" }} />
          Laporan Harian
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Isi laporan setiap selesai mengajar untuk mencatat progres siswa.
        </p>
      </div>

      {/* Form */}
      <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Siswa</label>
              <select value={siswaId} onChange={(e) => setSiswaId(e.target.value)} required style={{ ...inputStyle, background: "white" }}>
                <option value="">Pilih siswa...</option>
                {siswaList.map((s) => (
                  <option key={s.id} value={s.id}>{s.namaLengkap}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tanggal</label>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Nilai TO (opsional)</label>
              <input type="number" value={nilaiTO} onChange={(e) => setNilaiTO(e.target.value)} placeholder="0-100" min="0" max="100" step="0.1" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Materi yang Dipelajari</label>
            <textarea value={materi} onChange={(e) => setMateri(e.target.value)} required rows={2} placeholder="Apa saja yang dipelajari hari ini..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Perkembangan Siswa</label>
            <textarea value={perkembangan} onChange={(e) => setPerkembangan(e.target.value)} required rows={2} placeholder="Bagaimana perkembangan pemahaman siswa..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Catatan Khusus (opsional)</label>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2} placeholder="Hal-hal yang perlu diperhatikan..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
          {success && <div style={{ padding: "0.75rem 1rem", background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)", borderRadius: "12px", color: "var(--color-primary-700)", fontSize: "0.875rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} />Laporan berhasil disimpan!</div>}

          <button type="submit" disabled={loading} style={{ padding: "0.875rem 2rem", fontWeight: 700, color: "white", background: loading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: loading ? "none" : "0 4px 14px rgba(13,146,85,0.35)" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Menyimpan..." : "Simpan Laporan"}
          </button>
        </form>
      </div>

      {/* Riwayat */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-neutral-100)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }}>Riwayat Laporan</h2>
        </div>

        {loadingData ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : riwayat.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada laporan.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Tanggal", "Siswa", "Materi", "Perkembangan", "Nilai TO", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riwayat.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 500 }}>{new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{item.siswa?.namaLengkap}</td>
                    <td style={{ padding: "0.875rem 1rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.materiDipelajari}</td>
                    <td style={{ padding: "0.875rem 1rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.perkembangan}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{item.nilaiTO ?? "—"}</td>
                    <td style={{ padding: "0.875rem 1rem" }}><button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "0.25rem" }}><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
