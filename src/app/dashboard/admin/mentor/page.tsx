"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, X, Loader2, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

interface Mentor {
  id: string;
  nama: string;
  email: string;
  noHp: string | null;
  alamat: string | null;
  isAktif: boolean;
  createdAt: string;
}

export default function KelolaMentorPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");

  const fetchMentors = async () => {
    try {
      const res = await fetch("/api/mentor");
      if (res.ok) { const d = await res.json(); setMentors(d.data || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMentors(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setError("");
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, noHp: noHp || null, alamat: alamat || null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false); setNama(""); setEmail(""); setPassword(""); setNoHp(""); setAlamat("");
      fetchMentors();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const toggleAktif = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/mentor/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAktif: !currentStatus }),
      });
      fetchMentors();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus mentor ini? Data presensi dan laporan tetap tersimpan.")) return;
    try { await fetch(`/api/mentor/${id}`, { method: "DELETE" }); fetchMentors(); }
    catch (err) { console.error(err); }
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.9375rem", outline: "none", fontFamily: "inherit" };
  const labelStyle = { display: "block" as const, fontSize: "0.8125rem", fontWeight: 600 as const, color: "var(--text-primary)", marginBottom: "0.5rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserCog size={24} style={{ color: "var(--color-primary-500)" }} /> Kelola Mentor
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Tambah, edit, dan kelola akun mentor.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Tutup" : "Tambah Mentor"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "2rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Tambah Mentor Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div><label style={labelStyle}>Nama Lengkap *</label><input value={nama} onChange={(e) => setNama(e.target.value)} required style={inputStyle} placeholder="Ahmad Fauzi" /></div>
              <div><label style={labelStyle}>Email *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="mentor@email.com" /></div>
              <div><label style={labelStyle}>Password *</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="Min. 6 karakter" /></div>
              <div><label style={labelStyle}>No. HP</label><input value={noHp} onChange={(e) => setNoHp(e.target.value)} style={inputStyle} placeholder="08xxxxxxxxxx" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Alamat</label><input value={alamat} onChange={(e) => setAlamat(e.target.value)} style={inputStyle} placeholder="Alamat lengkap" /></div>
            </div>
            {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {formLoading ? "Menyimpan..." : "Simpan Mentor"}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
        ) : mentors.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada mentor. Klik "Tambah Mentor" untuk mulai.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Nama", "Email", "No. HP", "Status", "Terdaftar", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mentors.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{m.nama}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{m.email}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{m.noHp || "—"}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ padding: "0.25rem 0.625rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, background: m.isAktif ? "var(--color-primary-50)" : "#fef2f2", color: m.isAktif ? "var(--color-primary-700)" : "#dc2626" }}>
                        {m.isAktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", color: "var(--text-secondary)" }}>{new Date(m.createdAt).toLocaleDateString("id-ID")}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => toggleAktif(m.id, m.isAktif)} title={m.isAktif ? "Nonaktifkan" : "Aktifkan"} style={{ background: "none", border: "none", cursor: "pointer", color: m.isAktif ? "var(--color-primary-500)" : "var(--color-neutral-400)", padding: "0.25rem" }}>
                          {m.isAktif ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button onClick={() => handleDelete(m.id)} title="Hapus" style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "0.25rem" }}>
                          <Trash2 size={16} />
                        </button>
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
