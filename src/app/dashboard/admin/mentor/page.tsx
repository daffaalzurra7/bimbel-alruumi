"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, X, Loader2, ToggleLeft, ToggleRight, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

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
      const res = await fetch("/api/mentor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nama, email, password, noHp: noHp || null, alamat: alamat || null }) });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false); setNama(""); setEmail(""); setPassword(""); setNoHp(""); setAlamat("");
      fetchMentors();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const toggleAktif = async (id: string, current: boolean) => {
    try { await fetch(`/api/mentor/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isAktif: !current }) }); fetchMentors(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus mentor ini?")) return;
    try { await fetch(`/api/mentor/${id}`, { method: "DELETE" }); fetchMentors(); }
    catch (err) { console.error(err); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserCog size={24} style={{ color: "var(--color-primary-500)" }} /> Kelola Mentor
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Klik nama mentor untuk melihat detail & honor.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Tutup" : "Tambah Mentor"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "20px", padding: "1.5rem", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Tambah Mentor Baru</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div><label style={labelStyle}>Nama *</label><input value={nama} onChange={(e) => setNama(e.target.value)} required style={inputStyle} placeholder="Ahmad Fauzi" /></div>
              <div><label style={labelStyle}>Email *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Password *</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} /></div>
              <div><label style={labelStyle}>No. HP</label><input value={noHp} onChange={(e) => setNoHp(e.target.value)} style={inputStyle} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Alamat</label><input value={alamat} onChange={(e) => setAlamat(e.target.value)} style={inputStyle} /></div>
            </div>
            {error && <div style={{ padding: "0.75rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
            <button type="submit" disabled={formLoading} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {formLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {formLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>
      )}

      {/* Mentor Cards - responsive */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
      ) : mentors.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", padding: "3rem", textAlign: "center", border: "1px solid var(--color-neutral-100)" }}>
          <p style={{ color: "var(--text-secondary)" }}>Belum ada mentor.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {mentors.map((m) => (
            <div key={m.id} style={{ background: "white", borderRadius: "16px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
              <Link href={`/dashboard/admin/mentor/${m.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", padding: "1.25rem", borderBottom: "1px solid var(--color-neutral-100)", background: "linear-gradient(135deg, var(--color-primary-50), white)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-primary-800)", marginBottom: "0.125rem" }}>{m.nama}</h3>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{m.email}</div>
                  </div>
                  <ExternalLink size={16} style={{ color: "var(--color-primary-400)" }} />
                </div>
              </Link>
              <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem" }}>
                  <span style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600, background: m.isAktif ? "var(--color-primary-50)" : "#fef2f2", color: m.isAktif ? "var(--color-primary-700)" : "#dc2626" }}>
                    {m.isAktif ? "Aktif" : "Nonaktif"}
                  </span>
                  {m.noHp && <span style={{ color: "var(--text-secondary)" }}>{m.noHp}</span>}
                </div>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <button onClick={() => toggleAktif(m.id, m.isAktif)} title={m.isAktif ? "Nonaktifkan" : "Aktifkan"} style={{ background: "none", border: "none", cursor: "pointer", color: m.isAktif ? "var(--color-primary-500)" : "var(--color-neutral-400)", padding: "0.25rem" }}>
                    {m.isAktif ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <button onClick={() => handleDelete(m.id)} title="Hapus" style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "0.25rem" }}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
