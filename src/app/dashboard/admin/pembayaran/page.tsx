"use client";

import { useState, useEffect } from "react";
import {
  CreditCard, Plus, X, Loader2, CheckCircle2, XCircle,
  TrendingUp, TrendingDown, Wallet, Users, Check,
} from "lucide-react";

interface Pembayaran {
  id: string; bulan: number; tahun: number; jumlah: string; status: string;
  catatanAdmin: string | null; verifikasiAt: string | null; verifikasiOleh: string | null;
  siswa: { namaLengkap: string; jenjang: string; kelas: string };
}
interface MentorHonor {
  mentorId: string; nama: string; email: string; totalSesi: number;
  totalFee: number; totalTransport: number; totalBonus: number; totalHonor: number;
  payment: { id: string; status: string; jumlahDibayar: number; dibayarAt: string | null; catatan: string | null } | null;
}
interface Siswa { id: string; namaLengkap: string; }

const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const BULAN_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

export default function PembayaranPage() {
  const [tab, setTab] = useState<"siswa" | "mentor">("siswa");
  const [list, setList] = useState<Pembayaran[]>([]);
  const [mentorHonors, setMentorHonors] = useState<MentorHonor[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [payingMentor, setPayingMentor] = useState<string | null>(null);

  const now = new Date();
  const [siswaId, setSiswaId] = useState("");
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [jumlah, setJumlah] = useState("");

  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const fetchSiswa = async () => {
    try {
      const [pRes, sRes] = await Promise.all([fetch("/api/pembayaran"), fetch("/api/siswa")]);
      if (pRes.ok) { const d = await pRes.json(); setList(d.data || []); }
      if (sRes.ok) { const d = await sRes.json(); setSiswaList(d.data || []); }
    } catch (err) { console.error(err); }
  };

  const fetchMentor = async () => {
    try {
      const res = await fetch(`/api/pembayaran/mentor?bulan=${bulan}&tahun=${tahun}`);
      if (res.ok) { const d = await res.json(); setMentorHonors(d.data || []); }
    } catch (err) { console.error(err); }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchSiswa(), fetchMentor()]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { fetchMentor(); }, [bulan, tahun]);

  // Pemasukan = pembayaran siswa terverifikasi bulan ini
  const pemasukanBulanIni = list
    .filter((p) => p.bulan === bulan && p.tahun === tahun && p.status === "TERVERIFIKASI")
    .reduce((s, p) => s + Number(p.jumlah), 0);
  // Pengeluaran = mentor yang sudah dibayar bulan ini
  const pengeluaranBulanIni = mentorHonors
    .filter((m) => m.payment?.status === "SUDAH_DIBAYAR")
    .reduce((s, m) => s + (m.payment?.jumlahDibayar || 0), 0);

  const handleSubmitSiswa = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true); setError("");
    try {
      const res = await fetch("/api/pembayaran", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siswaId, bulan, tahun, jumlah: parseFloat(jumlah) }) });
      if (!res.ok) { const d = await res.json(); setError(d.error?.message || "Gagal"); return; }
      setShowForm(false); setSiswaId(""); setJumlah(""); fetchAll();
    } catch { setError("Kesalahan jaringan"); }
    finally { setFormLoading(false); }
  };

  const handleVerifikasi = async (id: string, status: string) => {
    try { await fetch(`/api/pembayaran/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); fetchAll(); }
    catch (err) { console.error(err); }
  };

  const handlePayMentor = async (m: MentorHonor) => {
    setPayingMentor(m.mentorId);
    try {
      await fetch("/api/pembayaran/mentor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: m.mentorId, bulan, tahun, totalHonor: m.totalHonor, jumlahDibayar: m.totalHonor, status: "SUDAH_DIBAYAR" }),
      });
      fetchMentor();
    } catch (err) { console.error(err); }
    finally { setPayingMentor(null); }
  };

  const handleUnpayMentor = async (m: MentorHonor) => {
    setPayingMentor(m.mentorId);
    try {
      await fetch("/api/pembayaran/mentor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: m.mentorId, bulan, tahun, totalHonor: m.totalHonor, status: "BELUM_DIBAYAR", jumlahDibayar: 0 }),
      });
      fetchMentor();
    } catch (err) { console.error(err); }
    finally { setPayingMentor(null); }
  };

  const statusStyle: Record<string, { bg: string; text: string }> = {
    MENUNGGU_VERIFIKASI: { bg: "#fef3c7", text: "#b45309" },
    TERVERIFIKASI: { bg: "var(--color-primary-50)", text: "var(--color-primary-700)" },
    DITOLAK: { bg: "#fef2f2", text: "#dc2626" },
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" };
  const cardStyle: React.CSSProperties = { background: "white", borderRadius: "16px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", padding: "1.25rem" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CreditCard size={24} style={{ color: "var(--color-primary-500)" }} /> Keuangan
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Kelola pembayaran siswa & honor mentor dalam satu tempat.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--color-primary-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={20} style={{ color: "var(--color-primary-600)" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Pemasukan {BULAN_SHORT[bulan - 1]}</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-primary-700)", fontFamily: "var(--font-outfit)" }}>{formatRp(pemasukanBulanIni)}</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingDown size={20} style={{ color: "#dc2626" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Pengeluaran {BULAN_SHORT[bulan - 1]}</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#dc2626", fontFamily: "var(--font-outfit)" }}>{formatRp(pengeluaranBulanIni)}</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: pemasukanBulanIni - pengeluaranBulanIni >= 0 ? "var(--color-primary-50)" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={20} style={{ color: pemasukanBulanIni - pengeluaranBulanIni >= 0 ? "var(--color-primary-600)" : "#b45309" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>Saldo {BULAN_SHORT[bulan - 1]}</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: pemasukanBulanIni - pengeluaranBulanIni >= 0 ? "var(--color-primary-700)" : "#b45309", fontFamily: "var(--font-outfit)" }}>{formatRp(pemasukanBulanIni - pengeluaranBulanIni)}</div>
          </div>
        </div>
      </div>

      {/* Month/Year Filter + Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} style={{ padding: "0.5rem 0.75rem", border: "2px solid var(--color-neutral-200)", borderRadius: "10px", fontSize: "0.8125rem", background: "white", fontFamily: "inherit" }}>
            {BULAN.map((n, i) => <option key={i} value={i + 1}>{n}</option>)}
          </select>
          <input type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} min={2024} max={2030} style={{ padding: "0.5rem 0.75rem", border: "2px solid var(--color-neutral-200)", borderRadius: "10px", fontSize: "0.8125rem", width: "80px" }} />
        </div>
        <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: "12px", padding: "0.25rem" }}>
          {[{ key: "siswa" as const, label: "Pembayaran Siswa", icon: CreditCard }, { key: "mentor" as const, label: "Honor Mentor", icon: Users }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "0.5rem 1rem", borderRadius: "10px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", border: "none",
              background: tab === t.key ? "white" : "transparent", color: tab === t.key ? "var(--color-primary-700)" : "var(--text-secondary)",
              boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              display: "flex", alignItems: "center", gap: "0.375rem", transition: "all 0.2s",
            }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TAB: PEMBAYARAN SISWA ===== */}
      {tab === "siswa" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.625rem 1rem", fontWeight: 600, color: "white", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", boxShadow: "0 4px 14px rgba(13,146,85,0.35)" }}>
              {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Tutup" : "Catat Pembayaran"}
            </button>
          </div>

          {showForm && (
            <div style={{ ...cardStyle, marginBottom: "1.5rem", borderRadius: "20px" }}>
              <form onSubmit={handleSubmitSiswa}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                  <div><label style={labelStyle}>Siswa *</label><select value={siswaId} onChange={(e) => setSiswaId(e.target.value)} required style={{ ...inputStyle, background: "white" }}><option value="">Pilih siswa...</option>{siswaList.map((s) => <option key={s.id} value={s.id}>{s.namaLengkap}</option>)}</select></div>
                  <div><label style={labelStyle}>Bulan *</label><select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} style={{ ...inputStyle, background: "white" }}>{BULAN_SHORT.map((n, i) => <option key={i} value={i + 1}>{n}</option>)}</select></div>
                  <div><label style={labelStyle}>Tahun *</label><input type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Jumlah (Rp) *</label><input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required min="0" style={inputStyle} placeholder="500000" /></div>
                </div>
                {error && <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
                <button type="submit" disabled={formLoading} style={{ padding: "0.625rem 1.25rem", fontWeight: 700, color: "white", background: formLoading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))", border: "none", borderRadius: "12px", cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem" }}>
                  {formLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </form>
            </div>
          )}

          <div style={{ ...cardStyle, overflow: "hidden", padding: 0, borderRadius: "20px" }}>
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
            ) : list.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada data pembayaran.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "650px" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-secondary)" }}>
                      {["Siswa", "Jenjang", "Periode", "Jumlah", "Status", "Aksi"].map((h) => (
                        <th key={h} style={{ padding: "0.625rem 0.75rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-neutral-100)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                        <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600 }}>{p.siswa.namaLengkap}</td>
                        <td style={{ padding: "0.625rem 0.75rem" }}><span style={{ padding: "0.125rem 0.5rem", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600, background: "#dbeafe", color: "#1d4ed8" }}>{p.siswa.jenjang}-{p.siswa.kelas}</span></td>
                        <td style={{ padding: "0.625rem 0.75rem" }}>{BULAN_SHORT[p.bulan - 1]} {p.tahun}</td>
                        <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700 }}>{formatRp(Number(p.jumlah))}</td>
                        <td style={{ padding: "0.625rem 0.75rem" }}>
                          <span style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600, background: statusStyle[p.status]?.bg, color: statusStyle[p.status]?.text }}>{p.status.replace(/_/g, " ")}</span>
                        </td>
                        <td style={{ padding: "0.625rem 0.75rem" }}>
                          {p.status === "MENUNGGU_VERIFIKASI" && (
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button onClick={() => handleVerifikasi(p.id, "TERVERIFIKASI")} title="Verifikasi" style={{ background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)", borderRadius: "8px", cursor: "pointer", color: "var(--color-primary-600)", padding: "0.375rem", display: "flex", alignItems: "center" }}><CheckCircle2 size={14} /></button>
                              <button onClick={() => handleVerifikasi(p.id, "DITOLAK")} title="Tolak" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.375rem", display: "flex", alignItems: "center" }}><XCircle size={14} /></button>
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
        </>
      )}

      {/* ===== TAB: HONOR MENTOR ===== */}
      {tab === "mentor" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>
          ) : mentorHonors.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Tidak ada mentor aktif.</div>
          ) : mentorHonors.map((m) => {
            const isPaid = m.payment?.status === "SUDAH_DIBAYAR";
            const isProcessing = payingMentor === m.mentorId;
            return (
              <div key={m.mentorId} style={{
                ...cardStyle, borderRadius: "16px", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center",
                borderLeft: `4px solid ${isPaid ? "var(--color-primary-500)" : m.totalHonor > 0 ? "#f59e0b" : "var(--color-neutral-200)"}`,
                background: isPaid ? "var(--color-primary-50)" : "white",
                transition: "all 0.2s",
              }}>
                {/* Mentor Info */}
                <div style={{ flex: "1 1 160px", minWidth: "140px" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{m.nama}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{m.email}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{m.totalSesi} sesi bulan ini</div>
                </div>

                {/* Honor Breakdown */}
                <div style={{ flex: "1 1 280px", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {[
                    { label: "Fee", value: m.totalFee, color: "var(--color-primary-700)" },
                    { label: "Transport", value: m.totalTransport, color: "#6366f1" },
                    { label: "Bonus", value: m.totalBonus, color: "var(--color-gold-700)" },
                  ].map((item) => (
                    <div key={item.label} style={{ minWidth: "80px" }}>
                      <div style={{ fontSize: "0.625rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: item.color }}>{formatRp(item.value)}</div>
                    </div>
                  ))}
                  <div style={{ minWidth: "100px", padding: "0.375rem 0.75rem", background: isPaid ? "var(--color-primary-100)" : "var(--bg-secondary)", borderRadius: "10px" }}>
                    <div style={{ fontSize: "0.625rem", color: isPaid ? "var(--color-primary-600)" : "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>TOTAL HONOR</div>
                    <div style={{ fontSize: "1.125rem", fontWeight: 800, color: isPaid ? "var(--color-primary-700)" : "var(--text-primary)", fontFamily: "var(--font-outfit)" }}>{formatRp(m.totalHonor)}</div>
                  </div>
                </div>

                {/* Action */}
                <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  {isPaid ? (
                    <>
                      <button onClick={() => handleUnpayMentor(m)} disabled={isProcessing} style={{
                        padding: "0.5rem 1rem", borderRadius: "10px", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
                        background: "var(--color-primary-500)", color: "white", border: "none",
                        display: "flex", alignItems: "center", gap: "0.375rem",
                      }}>
                        {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Sudah Dibayar
                      </button>
                      {m.payment?.dibayarAt && (
                        <span style={{ fontSize: "0.625rem", color: "var(--color-primary-600)" }}>
                          {new Date(m.payment.dibayarAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </>
                  ) : (
                    <button onClick={() => handlePayMentor(m)} disabled={isProcessing || m.totalHonor === 0} style={{
                      padding: "0.5rem 1rem", borderRadius: "10px", fontSize: "0.8125rem", fontWeight: 700, cursor: m.totalHonor === 0 ? "not-allowed" : "pointer",
                      background: m.totalHonor === 0 ? "var(--color-neutral-200)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: m.totalHonor === 0 ? "var(--text-secondary)" : "white", border: "none",
                      display: "flex", alignItems: "center", gap: "0.375rem",
                      boxShadow: m.totalHonor > 0 ? "0 3px 10px rgba(245,158,11,0.3)" : "none",
                    }}>
                      {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />} Bayar Honor
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
