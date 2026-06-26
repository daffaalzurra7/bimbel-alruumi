"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, X, Loader2, Trash2, Pencil, Check, Save, Filter } from "lucide-react";

interface Mentor { id: string; nama: string; }
interface Siswa {
  id: string;
  namaLengkap: string;
  namaOrtu: string;
  noHpOrtu: string;
  emailOrtu: string | null;
  jenjang: string;
  kelas: string;
  sekolahAsal: string | null;
  alamatRumah: string;
  programBelajar: string;
  status: string;
  mentors?: Mentor[];
}

const emptyForm = { namaLengkap: "", namaOrtu: "", noHpOrtu: "", emailOrtu: "", jenjang: "SD", kelas: "", sekolahAsal: "", alamatRumah: "", programBelajar: "" };

export default function KelolaSiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [mentorList, setMentorList] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [editStatusId, setEditStatusId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [editSiswaId, setEditSiswaId] = useState<string | null>(null);

  // Filters
  const [filterJenjang, setFilterJenjang] = useState("");
  const [filterMentor, setFilterMentor] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterJenjang) params.set("jenjang", filterJenjang);
      if (filterMentor) params.set("mentorId", filterMentor);
      const [sRes, mRes] = await Promise.all([
        fetch(`/api/siswa?${params.toString()}`),
        fetch("/api/mentor"),
      ]);
      if (sRes.ok) { const d = await sRes.json(); setSiswaList(d.data || []); }
      if (mRes.ok) { const d = await mRes.json(); setMentorList(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filterJenjang, filterMentor]);

  const openCreate = () => { setEditMode("create"); setEditSiswaId(null); setForm(emptyForm); setShowForm(true); setError(""); };
  const openEdit = (s: Siswa) => {
    setEditMode("edit"); setEditSiswaId(s.id);
    setForm({ namaLengkap: s.namaLengkap, namaOrtu: s.namaOrtu, noHpOrtu: s.noHpOrtu, emailOrtu: s.emailOrtu || "", jenjang: s.jenjang, kelas: s.kelas, sekolahAsal: s.sekolahAsal || "", alamatRumah: s.alamatRumah, programBelajar: s.programBelajar });
    setShowForm(true); setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true); setError("");
    try {
      const url = editMode === "edit" ? `/api/siswa/${editSiswaId}` : "/api/siswa";
      const method = editMode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false); setForm(emptyForm); fetchData();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try { await fetch(`/api/siswa/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); setEditStatusId(null); fetchData(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin nonaktifkan siswa ini?")) return;
    try { await fetch(`/api/siswa/${id}`, { method: "DELETE" }); fetchData(); } catch (err) { console.error(err); }
  };

  const updateForm = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" };
  const jenjangColor: Record<string, { bg: string; text: string }> = { SD: { bg: "#dbeafe", text: "#1d4ed8" }, SMP: { bg: "#ede9fe", text: "#6d28d9" }, SMA: { bg: "#fce7f3", text: "#be185d" } };
  const statusColor: Record<string, { bg: string; text: string }> = { AKTIF: { bg: "var(--color-primary-50)", text: "var(--color-primary-700)" }, NONAKTIF: { bg: "#fef2f2", text: "#dc2626" }, CALON_SISWA: { bg: "var(--color-gold-50)", text: "var(--color-gold-700)" } };
  const selectFilter: React.CSSProperties = { padding: "0.5rem 0.75rem", border: "2px solid var(--color-neutral-200)", borderRadius: "10px", fontSize: "0.8125rem", background: "white", fontFamily: "inherit" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GraduationCap size={24} style={{ color: "var(--color-primary-500)" }} /> Kelola Siswa
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Tambah, edit, filter dan kelola data siswa bimbingan.</p>
        </div>
        <button onClick={showForm ? () => setShowForm(false) : openCreate} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Tambah Siswa"}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <Filter size={16} style={{ color: "var(--text-secondary)" }} />
        <select value={filterJenjang} onChange={(e) => setFilterJenjang(e.target.value)} style={selectFilter}>
          <option value="">Semua Jenjang</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
        </select>
        <select value={filterMentor} onChange={(e) => setFilterMentor(e.target.value)} style={selectFilter}>
          <option value="">Semua Mentor</option>
          {mentorList.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
        </select>
        {(filterJenjang || filterMentor) && (
          <button onClick={() => { setFilterJenjang(""); setFilterMentor(""); }} style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer" }}>
            Reset Filter
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "1.5rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
            {editMode === "edit" ? `✏️ Edit Data: ${form.namaLengkap}` : "Tambah Siswa Baru"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div><label style={labelStyle}>Nama Lengkap *</label><input value={form.namaLengkap} onChange={(e) => updateForm("namaLengkap", e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Nama Orang Tua *</label><input value={form.namaOrtu} onChange={(e) => updateForm("namaOrtu", e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>No. HP Ortu *</label><input value={form.noHpOrtu} onChange={(e) => updateForm("noHpOrtu", e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Email Ortu</label><input type="email" value={form.emailOrtu} onChange={(e) => updateForm("emailOrtu", e.target.value)} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Jenjang *</label>
                <select value={form.jenjang} onChange={(e) => updateForm("jenjang", e.target.value)} style={{ ...inputStyle, background: "white" }}>
                  <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option>
                </select>
              </div>
              <div><label style={labelStyle}>Kelas *</label><input value={form.kelas} onChange={(e) => updateForm("kelas", e.target.value)} required style={inputStyle} placeholder="6, 7, 8..." /></div>
              <div><label style={labelStyle}>Sekolah</label><input value={form.sekolahAsal} onChange={(e) => updateForm("sekolahAsal", e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Program *</label><input value={form.programBelajar} onChange={(e) => updateForm("programBelajar", e.target.value)} required style={inputStyle} placeholder="Reguler" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Alamat *</label><input value={form.alamatRumah} onChange={(e) => updateForm("alamatRumah", e.target.value)} required style={inputStyle} /></div>
            </div>
            {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : editMode === "edit" ? <Save size={16} /> : <Plus size={16} />}
              {formLoading ? "Menyimpan..." : editMode === "edit" ? "Update Data" : "Simpan"}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : siswaList.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Tidak ada data siswa{filterJenjang || filterMentor ? " dengan filter ini" : ""}.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "850px" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Nama", "Jenjang", "Sekolah", "Mentor", "Ortu / HP", "Program", "Status", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 0.75rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {siswaList.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>{s.namaLengkap}</td>
                    <td style={{ padding: "0.75rem" }}><span style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600, background: jenjangColor[s.jenjang]?.bg, color: jenjangColor[s.jenjang]?.text }}>{s.jenjang}-{s.kelas}</span></td>
                    <td style={{ padding: "0.75rem" }}>{s.sekolahAsal || "—"}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {s.mentors && s.mentors.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                          {s.mentors.map((m) => (
                            <span key={m.id} style={{ padding: "0.125rem 0.5rem", background: "#dbeafe", color: "#1d4ed8", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600 }}>{m.nama}</span>
                          ))}
                        </div>
                      ) : <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Belum di-assign</span>}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>{s.namaOrtu}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{s.noHpOrtu}</div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{s.programBelajar}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {editStatusId === s.id ? (
                        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ padding: "0.2rem 0.375rem", borderRadius: "6px", fontSize: "0.6875rem", border: "1px solid var(--color-neutral-200)", background: "white" }}>
                            <option value="AKTIF">AKTIF</option><option value="NONAKTIF">NONAKTIF</option><option value="CALON_SISWA">CALON SISWA</option>
                          </select>
                          <button onClick={() => handleUpdateStatus(s.id, editStatus)} style={{ background: "var(--color-primary-500)", border: "none", borderRadius: "6px", cursor: "pointer", color: "white", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={10} /></button>
                          <button onClick={() => setEditStatusId(null)} style={{ background: "var(--color-neutral-200)", border: "none", borderRadius: "6px", cursor: "pointer", color: "var(--text-secondary)", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={10} /></button>
                        </div>
                      ) : (
                        <span style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600, background: statusColor[s.status]?.bg, color: statusColor[s.status]?.text, cursor: "pointer" }} onClick={() => { setEditStatusId(s.id); setEditStatus(s.status); }} title="Klik untuk ubah status">
                          {s.status.replace(/_/g, " ")}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button onClick={() => openEdit(s)} title="Edit Data" style={{ background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)", borderRadius: "8px", cursor: "pointer", color: "var(--color-primary-600)", padding: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(s.id)} title="Nonaktifkan" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={13} /></button>
                      </div>
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
