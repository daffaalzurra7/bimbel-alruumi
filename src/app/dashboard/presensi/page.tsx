"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, Plus, X, Loader2 } from "lucide-react";

interface SiswaOption { id: string; namaLengkap: string; jenjang: string; kelas: string; }
interface Presensi {
  id: string;
  tanggal: string;
  jamMasuk: string;
  durasiMenit: number;
  catatan: string | null;
  siswa: { namaLengkap: string; jenjang: string; kelas: string } | null;
}

export default function PresensiPage() {
  const [presensiList, setPresensiList] = useState<Presensi[]>([]);
  const [siswaOptions, setSiswaOptions] = useState<SiswaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [tanggal, setTanggal] = useState(today);
  const [jamMasuk, setJamMasuk] = useState("");
  const [durasiMenit, setDurasiMenit] = useState(90);
  const [siswaId, setSiswaId] = useState("");
  const [catatan, setCatatan] = useState("");

  const fetchData = async () => {
    try {
      const [presRes, jadwalRes] = await Promise.all([
        fetch("/api/presensi"),
        fetch("/api/siswa?myStudents=true"),
      ]);
      if (presRes.ok) { const d = await presRes.json(); setPresensiList(d.data || []); }
      // Fetch mentor's students from jadwal
      const jRes = await fetch("/api/jadwal?mySiswa=true");
      if (jRes.ok) {
        const d = await jRes.json();
        const students: SiswaOption[] = [];
        const seen = new Set<string>();
        for (const j of (d.data || [])) {
          if (j.siswa && !seen.has(j.siswa.id || j.siswaId)) {
            const sid = j.siswa.id || j.siswaId;
            seen.add(sid);
            students.push({ id: sid, namaLengkap: j.siswa.namaLengkap, jenjang: j.siswa.jenjang, kelas: j.siswa.kelas });
          }
        }
        setSiswaOptions(students);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/presensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tanggal, jamMasuk, durasiMenit, catatan: catatan || null, siswaId: siswaId || null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setSuccess("Presensi berhasil dicatat! ✅");
      setShowForm(false); setJamMasuk(""); setCatatan(""); setSiswaId("");
      fetchData();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ClipboardCheck size={24} style={{ color: "var(--color-primary-500)" }} /> Presensi Kerja
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Catat kehadiran mengajar dan pilih siswa yang diampu.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Catat Presensi"}
        </button>
      </div>

      {success && <div style={{ padding: "0.75rem 1rem", background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)", borderRadius: "12px", color: "var(--color-primary-700)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.5rem" }}>{success}</div>}

      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "1.5rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>📝 Catat Presensi Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              {/* Siswa dropdown */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ ...labelStyle, color: "var(--color-primary-700)" }}>👨‍🎓 Siswa yang Diampu *</label>
                <select value={siswaId} onChange={(e) => setSiswaId(e.target.value)} required style={{ ...inputStyle, background: "white", borderColor: "var(--color-primary-300)" }}>
                  <option value="">Pilih siswa...</option>
                  {siswaOptions.map((s) => <option key={s.id} value={s.id}>{s.namaLengkap} ({s.jenjang}-{s.kelas})</option>)}
                </select>
                {siswaOptions.length === 0 && !loading && (
                  <p style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.25rem" }}>Belum ada siswa yang di-assign admin. Hubungi admin.</p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Tanggal</label>
                <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Jam Masuk *</label>
                <input type="time" value={jamMasuk} onChange={(e) => setJamMasuk(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Durasi *</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[60, 90, 120].map((d) => (
                    <button key={d} type="button" onClick={() => setDurasiMenit(d)} style={{
                      flex: 1, padding: "0.75rem", borderRadius: "12px", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
                      border: `2px solid ${durasiMenit === d ? "var(--color-primary-500)" : "var(--color-neutral-200)"}`,
                      background: durasiMenit === d ? "var(--color-primary-50)" : "white",
                      color: durasiMenit === d ? "var(--color-primary-700)" : "var(--text-secondary)",
                    }}>{d} mnt</button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Catatan</label>
                <input value={catatan} onChange={(e) => setCatatan(e.target.value)} style={inputStyle} placeholder="Materi yang diajarkan..." />
              </div>
            </div>
            {error && <div style={{ padding: "0.75rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />} {formLoading ? "Menyimpan..." : "Simpan Presensi"}
            </button>
          </form>
        </div>
      )}

      {/* Riwayat */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--color-neutral-100)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>📋 Riwayat Presensi</h3>
        </div>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : presensiList.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada presensi bulan ini.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Tanggal", "Hari", "Siswa", "Jam", "Durasi", "Catatan"].map((h) => (
                    <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {presensiList.map((p) => {
                  const d = new Date(p.tanggal);
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                      <td style={{ padding: "0.625rem 0.875rem", fontWeight: 500 }}>{d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td style={{ padding: "0.625rem 0.875rem", color: "var(--text-secondary)" }}>{d.toLocaleDateString("id-ID", { weekday: "long" })}</td>
                      <td style={{ padding: "0.625rem 0.875rem" }}>
                        {p.siswa ? (
                          <span style={{ padding: "0.15rem 0.5rem", background: "#ede9fe", color: "#6d28d9", borderRadius: "6px", fontWeight: 600, fontSize: "0.75rem" }}>
                            {p.siswa.namaLengkap}
                          </span>
                        ) : <span style={{ color: "var(--text-secondary)" }}>—</span>}
                      </td>
                      <td style={{ padding: "0.625rem 0.875rem" }}><span style={{ padding: "0.15rem 0.5rem", background: "var(--color-primary-50)", color: "var(--color-primary-700)", borderRadius: "6px", fontWeight: 600 }}>{p.jamMasuk}</span></td>
                      <td style={{ padding: "0.625rem 0.875rem" }}><span style={{ padding: "0.15rem 0.5rem", background: "var(--color-gold-50)", color: "var(--color-gold-700)", borderRadius: "6px", fontWeight: 600 }}>{p.durasiMenit} mnt</span></td>
                      <td style={{ padding: "0.625rem 0.875rem", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.catatan || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
