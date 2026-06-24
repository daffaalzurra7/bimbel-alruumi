"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, X, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Pembayaran {
  id: string;
  bulan: number;
  tahun: number;
  jumlah: string;
  status: string;
  catatanAdmin: string | null;
  verifikasiAt: string | null;
  verifikasiOleh: string | null;
  siswa: { namaLengkap: string; jenjang: string; kelas: string };
}

interface Siswa { id: string; namaLengkap: string; }

const bulanNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function PembayaranPage() {
  const [list, setList] = useState<Pembayaran[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const now = new Date();
  const [siswaId, setSiswaId] = useState("");
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [jumlah, setJumlah] = useState("");

  const fetchAll = async () => {
    try {
      const [pRes, sRes] = await Promise.all([fetch("/api/pembayaran"), fetch("/api/siswa")]);
      if (pRes.ok) { const d = await pRes.json(); setList(d.data || []); }
      if (sRes.ok) { const d = await sRes.json(); setSiswaList(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true); setError("");
    try {
      const res = await fetch("/api/pembayaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siswaId, bulan, tahun, jumlah: parseFloat(jumlah) }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false); setSiswaId(""); setJumlah(""); fetchAll();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const handleVerifikasi = async (id: string, status: string) => {
    try {
      await fetch(`/api/pembayaran/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const statusStyle: Record<string, { bg: string; text: string }> = {
    MENUNGGU_VERIFIKASI: { bg: "#fef3c7", text: "#b45309" },
    TERVERIFIKASI: { bg: "var(--color-primary-50)", text: "var(--color-primary-700)" },
    DITOLAK: { bg: "#fef2f2", text: "#dc2626" },
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit" };
  const labelStyle = { display: "block" as const, fontSize: "0.8125rem", fontWeight: 600 as const, color: "var(--text-primary)", marginBottom: "0.5rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CreditCard size={24} style={{ color: "var(--color-primary-500)" }} /> Pembayaran
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Kelola dan verifikasi pembayaran siswa.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Catat Pembayaran"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={labelStyle}>Siswa *</label>
                <select value={siswaId} onChange={(e) => setSiswaId(e.target.value)} required style={{ ...inputStyle, background: "white" }}>
                  <option value="">Pilih siswa...</option>
                  {siswaList.map((s) => <option key={s.id} value={s.id}>{s.namaLengkap}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Bulan *</label>
                <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} style={{ ...inputStyle, background: "white" }}>
                  {bulanNames.map((n, i) => <option key={i} value={i + 1}>{n}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Tahun *</label><input type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Jumlah (Rp) *</label><input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required min="0" style={inputStyle} placeholder="500000" /></div>
            </div>
            {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {formLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : list.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada data pembayaran.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Siswa", "Periode", "Jumlah", "Status", "Diverifikasi", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{p.siswa.namaLengkap}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{bulanNames[p.bulan - 1]} {p.tahun}</td>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>Rp {Number(p.jumlah).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ padding: "0.25rem 0.625rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, background: statusStyle[p.status]?.bg, color: statusStyle[p.status]?.text }}>{p.status.replace(/_/g, " ")}</span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      {p.verifikasiOleh ? `${p.verifikasiOleh}` : "—"}
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      {p.status === "MENUNGGU_VERIFIKASI" && (
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          <button onClick={() => handleVerifikasi(p.id, "TERVERIFIKASI")} title="Verifikasi" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary-500)", padding: "0.25rem" }}><CheckCircle2 size={18} /></button>
                          <button onClick={() => handleVerifikasi(p.id, "DITOLAK")} title="Tolak" style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "0.25rem" }}><XCircle size={18} /></button>
                        </div>
                      )}
                    </td>
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
