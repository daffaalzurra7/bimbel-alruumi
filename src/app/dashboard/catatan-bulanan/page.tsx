"use client";

import { useState, useEffect } from "react";
import { BookMarked, Save, Loader2, CheckCircle2, Trash2 } from "lucide-react";

interface CatatanBulanan {
  id: string;
  bulan: number;
  tahun: number;
  catatanMateri: string;
  refleksi: string | null;
}

const bulanNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export default function CatatanBulananPage() {
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [catatanMateri, setCatatanMateri] = useState("");
  const [refleksi, setRefleksi] = useState("");
  const [riwayat, setRiwayat] = useState<CatatanBulanan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/catatan-bulanan");
      if (res.ok) { const d = await res.json(); setRiwayat(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);

    try {
      const res = await fetch("/api/catatan-bulanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulan, tahun, catatanMateri, refleksi: refleksi || null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal menyimpan"); return; }
      setSuccess(true); setCatatanMateri(""); setRefleksi(""); fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Kesalahan jaringan"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus?")) return;
    try { await fetch(`/api/catatan-bulanan/${id}`, { method: "DELETE" }); fetchData(); }
    catch (err) { console.error(err); }
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit" };
  const labelStyle = { display: "block" as const, fontSize: "0.8125rem", fontWeight: 600 as const, color: "var(--text-primary)", marginBottom: "0.5rem" };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookMarked size={24} style={{ color: "var(--color-primary-500)" }} /> Catatan Bulanan
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Refleksi dan catatan materi yang sudah diajarkan setiap bulan.
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Bulan</label>
              <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} style={{ ...inputStyle, background: "white" }}>
                {bulanNames.map((n, i) => <option key={i} value={i + 1}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tahun</label>
              <input type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} min={2024} max={2030} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Catatan Materi</label>
            <textarea value={catatanMateri} onChange={(e) => setCatatanMateri(e.target.value)} required rows={3} placeholder="Materi apa saja yang sudah diajarkan bulan ini..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Refleksi (opsional)</label>
            <textarea value={refleksi} onChange={(e) => setRefleksi(e.target.value)} rows={3} placeholder="Refleksi tentang proses mengajar..." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
          {success && <div style={{ padding: "0.75rem 1rem", background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)", borderRadius: "12px", color: "var(--color-primary-700)", fontSize: "0.875rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><CheckCircle2 size={16} />Catatan berhasil disimpan!</div>}

          <button type="submit" disabled={loading} style={{ padding: "0.875rem 2rem", fontWeight: 700, color: "white", background: loading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: loading ? "none" : "0 4px 14px rgba(13,146,85,0.35)" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Menyimpan..." : "Simpan Catatan"}
          </button>
        </form>
      </div>

      {/* Riwayat */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-neutral-100)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }}>Riwayat Catatan</h2>
        </div>
        {loadingData ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : riwayat.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada catatan bulanan.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Bulan", "Catatan Materi", "Refleksi", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riwayat.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 500 }}>{bulanNames[item.bulan - 1]} {item.tahun}</td>
                    <td style={{ padding: "0.875rem 1rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.catatanMateri}</td>
                    <td style={{ padding: "0.875rem 1rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.refleksi || "—"}</td>
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
