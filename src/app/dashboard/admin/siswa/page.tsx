"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, X, Loader2, Trash2 } from "lucide-react";

interface Siswa {
  id: string;
  namaLengkap: string;
  namaOrtu: string;
  noHpOrtu: string;
  jenjang: string;
  kelas: string;
  sekolahAsal: string | null;
  alamatRumah: string;
  programBelajar: string;
  status: string;
}

export default function KelolaSiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ namaLengkap: "", namaOrtu: "", noHpOrtu: "", emailOrtu: "", jenjang: "SD", kelas: "", sekolahAsal: "", alamatRumah: "", programBelajar: "" });

  const fetchSiswa = async () => {
    try {
      const res = await fetch("/api/siswa");
      if (res.ok) { const d = await res.json(); setSiswaList(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSiswa(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setError("");
    try {
      const res = await fetch("/api/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false);
      setForm({ namaLengkap: "", namaOrtu: "", noHpOrtu: "", emailOrtu: "", jenjang: "SD", kelas: "", sekolahAsal: "", alamatRumah: "", programBelajar: "" });
      fetchSiswa();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin nonaktifkan siswa ini?")) return;
    try { await fetch(`/api/siswa/${id}`, { method: "DELETE" }); fetchSiswa(); }
    catch (err) { console.error(err); }
  };

  const updateForm = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const inputStyle = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit" };
  const labelStyle = { display: "block" as const, fontSize: "0.8125rem", fontWeight: 600 as const, color: "var(--text-primary)", marginBottom: "0.5rem" };

  const jenjangColor: Record<string, { bg: string; text: string }> = { SD: { bg: "#dbeafe", text: "#1d4ed8" }, SMP: { bg: "#ede9fe", text: "#6d28d9" }, SMA: { bg: "#fce7f3", text: "#be185d" } };
  const statusColor: Record<string, { bg: string; text: string }> = { AKTIF: { bg: "var(--color-primary-50)", text: "var(--color-primary-700)" }, NONAKTIF: { bg: "#fef2f2", text: "#dc2626" }, CALON_SISWA: { bg: "var(--color-gold-50)", text: "var(--color-gold-700)" } };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GraduationCap size={24} style={{ color: "var(--color-primary-500)" }} /> Kelola Siswa
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Tambah dan kelola data siswa bimbingan.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Tambah Siswa"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Tambah Siswa Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div><label style={labelStyle}>Nama Lengkap *</label><input value={form.namaLengkap} onChange={(e) => updateForm("namaLengkap", e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Nama Orang Tua *</label><input value={form.namaOrtu} onChange={(e) => updateForm("namaOrtu", e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>No. HP Orang Tua *</label><input value={form.noHpOrtu} onChange={(e) => updateForm("noHpOrtu", e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Email Orang Tua</label><input type="email" value={form.emailOrtu} onChange={(e) => updateForm("emailOrtu", e.target.value)} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Jenjang *</label>
                <select value={form.jenjang} onChange={(e) => updateForm("jenjang", e.target.value)} style={{ ...inputStyle, background: "white" }}>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                </select>
              </div>
              <div><label style={labelStyle}>Kelas *</label><input value={form.kelas} onChange={(e) => updateForm("kelas", e.target.value)} required style={inputStyle} placeholder="6, 7, 8..." /></div>
              <div><label style={labelStyle}>Sekolah Asal</label><input value={form.sekolahAsal} onChange={(e) => updateForm("sekolahAsal", e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Program Belajar *</label><input value={form.programBelajar} onChange={(e) => updateForm("programBelajar", e.target.value)} required style={inputStyle} placeholder="Reguler, Intensif..." /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Alamat Rumah *</label><input value={form.alamatRumah} onChange={(e) => updateForm("alamatRumah", e.target.value)} required style={inputStyle} /></div>
            </div>
            {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {formLoading ? "Menyimpan..." : "Simpan Siswa"}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : siswaList.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada data siswa.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Nama", "Jenjang", "Sekolah", "Ortu", "No. HP Ortu", "Program", "Status", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {siswaList.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{s.namaLengkap}</td>
                    <td style={{ padding: "0.875rem 1rem" }}><span style={{ padding: "0.25rem 0.625rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, background: jenjangColor[s.jenjang]?.bg, color: jenjangColor[s.jenjang]?.text }}>{s.jenjang} - {s.kelas}</span></td>
                    <td style={{ padding: "0.875rem 1rem" }}>{s.sekolahAsal || "—"}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{s.namaOrtu}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{s.noHpOrtu}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{s.programBelajar}</td>
                    <td style={{ padding: "0.875rem 1rem" }}><span style={{ padding: "0.25rem 0.625rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, background: statusColor[s.status]?.bg, color: statusColor[s.status]?.text }}>{s.status}</span></td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <button onClick={() => handleDelete(s.id)} title="Nonaktifkan" style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "0.25rem" }}><Trash2 size={16} /></button>
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
