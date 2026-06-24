"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, X, Loader2, Trash2, Pencil, Save } from "lucide-react";

interface Mentor { id: string; nama: string; }
interface Siswa { id: string; namaLengkap: string; jenjang: string; kelas: string; }
interface Jadwal {
  id: string;
  hariMengajar: string[];
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string[];
  catatan: string | null;
  mentorId: string;
  siswaId: string;
  siswa: { namaLengkap: string; jenjang: string; kelas: string };
  mentor: { nama: string };
}

const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function KelolaJadwalPage() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [editJadwalId, setEditJadwalId] = useState<string | null>(null);
  const [siswaId, setSiswaId] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [hariMengajar, setHariMengajar] = useState<string[]>([]);
  const [jamMulai, setJamMulai] = useState("08:00");
  const [jamSelesai, setJamSelesai] = useState("09:30");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [catatan, setCatatan] = useState("");

  const fetchAll = async () => {
    try {
      const [jRes, mRes, sRes] = await Promise.all([
        fetch("/api/jadwal"), fetch("/api/mentor"), fetch("/api/siswa"),
      ]);
      if (jRes.ok) { const d = await jRes.json(); setJadwalList(d.data || []); }
      if (mRes.ok) { const d = await mRes.json(); setMentors(d.data || []); }
      if (sRes.ok) { const d = await sRes.json(); setSiswaList(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setSiswaId(""); setMentorId(""); setHariMengajar([]);
    setJamMulai("08:00"); setJamSelesai("09:30");
    setMataPelajaran(""); setCatatan("");
    setEditMode("create"); setEditJadwalId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
    setError("");
  };

  const openEdit = (j: Jadwal) => {
    setEditMode("edit");
    setEditJadwalId(j.id);
    setSiswaId(j.siswaId);
    setMentorId(j.mentorId);
    setHariMengajar([...j.hariMengajar]);
    setJamMulai(j.jamMulai);
    setJamSelesai(j.jamSelesai);
    setMataPelajaran(j.mataPelajaran.join(", "));
    setCatatan(j.catatan || "");
    setShowForm(true);
    setError("");
  };

  const toggleHari = (hari: string) => {
    setHariMengajar((prev) => prev.includes(hari) ? prev.filter((h) => h !== hari) : [...prev, hari]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hariMengajar.length === 0) { setError("Pilih minimal 1 hari mengajar"); return; }
    setFormLoading(true); setError("");
    try {
      const mapel = mataPelajaran.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = { siswaId, mentorId, hariMengajar, jamMulai, jamSelesai, mataPelajaran: mapel, catatan: catatan || null };

      const url = editMode === "edit" ? `/api/jadwal/${editJadwalId}` : "/api/jadwal";
      const method = editMode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false);
      resetForm();
      fetchAll();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Nonaktifkan jadwal ini?")) return;
    try { await fetch(`/api/jadwal/${id}`, { method: "DELETE" }); fetchAll(); }
    catch (err) { console.error(err); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={24} style={{ color: "var(--color-primary-500)" }} /> Kelola Jadwal
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Assign & edit jadwal mentor-siswa. Klik ✏️ untuk pindah jadwal/mentor.</p>
        </div>
        <button onClick={showForm ? () => { setShowForm(false); resetForm(); } : openCreate} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Tambah Jadwal"}
        </button>
      </div>

      {/* Form — Create & Edit */}
      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "1.5rem", border: `2px solid ${editMode === "edit" ? "var(--color-gold-300)" : "var(--color-neutral-100)"}`, boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>
            {editMode === "edit" ? "✏️ Edit Jadwal" : "Tambah Jadwal Baru"}
            {editMode === "edit" && (
              <span style={{ fontSize: "0.8125rem", fontWeight: 400, color: "var(--text-secondary)", marginLeft: "0.5rem" }}>
                — Bisa pindah mentor, ubah hari & jam
              </span>
            )}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Siswa *</label>
                <select value={siswaId} onChange={(e) => setSiswaId(e.target.value)} required style={{ ...inputStyle, background: "white" }}>
                  <option value="">Pilih siswa...</option>
                  {siswaList.map((s) => <option key={s.id} value={s.id}>{s.namaLengkap} ({s.jenjang}-{s.kelas})</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, color: editMode === "edit" ? "var(--color-gold-700)" : "var(--text-primary)" }}>
                  Mentor * {editMode === "edit" && "🔄"}
                </label>
                <select value={mentorId} onChange={(e) => setMentorId(e.target.value)} required style={{ ...inputStyle, background: "white", borderColor: editMode === "edit" ? "var(--color-gold-400)" : "var(--color-neutral-200)" }}>
                  <option value="">Pilih mentor...</option>
                  {mentors.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Jam Mulai *</label><input type="time" value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Jam Selesai *</label><input type="time" value={jamSelesai} onChange={(e) => setJamSelesai(e.target.value)} required style={inputStyle} /></div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Hari Mengajar *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {HARI_OPTIONS.map((h) => (
                    <button key={h} type="button" onClick={() => toggleHari(h)} style={{
                      padding: "0.5rem 1rem", borderRadius: "10px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                      border: `2px solid ${hariMengajar.includes(h) ? "var(--color-primary-500)" : "var(--color-neutral-200)"}`,
                      background: hariMengajar.includes(h) ? "var(--color-primary-50)" : "white",
                      color: hariMengajar.includes(h) ? "var(--color-primary-700)" : "var(--text-secondary)",
                    }}>{h}</button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Mata Pelajaran * (pisah dengan koma)</label><input value={mataPelajaran} onChange={(e) => setMataPelajaran(e.target.value)} required style={inputStyle} placeholder="Matematika, Fisika, Kimia" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Catatan</label><input value={catatan} onChange={(e) => setCatatan(e.target.value)} style={inputStyle} placeholder="Catatan tambahan..." /></div>
            </div>
            {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : editMode === "edit" ? "linear-gradient(135deg, var(--color-gold-500), var(--color-gold-700))" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : editMode === "edit" ? <Save size={16} /> : <Plus size={16} />}
              {formLoading ? "Menyimpan..." : editMode === "edit" ? "Update Jadwal" : "Simpan Jadwal"}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : jadwalList.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada jadwal.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "700px" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Siswa", "Mentor", "Hari", "Jam", "Mata Pelajaran", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 0.875rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jadwalList.map((j) => (
                  <tr key={j.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.75rem 0.875rem", fontWeight: 600 }}>{j.siswa.namaLengkap} <span style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>({j.siswa.jenjang}-{j.siswa.kelas})</span></td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>{j.mentor.nama}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                        {j.hariMengajar.map((h) => (
                          <span key={h} style={{ padding: "0.125rem 0.5rem", background: "var(--color-primary-50)", color: "var(--color-primary-700)", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600 }}>{h}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem 0.875rem", whiteSpace: "nowrap" }}>{j.jamMulai}—{j.jamSelesai}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>{j.mataPelajaran.join(", ")}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>
                      <div style={{ display: "flex", gap: "0.375rem" }}>
                        <button onClick={() => openEdit(j)} title="Edit Jadwal" style={{ background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)", borderRadius: "8px", cursor: "pointer", color: "var(--color-primary-600)", padding: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(j.id)} title="Nonaktifkan" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
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
