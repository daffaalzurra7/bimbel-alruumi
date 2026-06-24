"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ClipboardCheck, Clock, Users, FileText,
  DollarSign, Plus, Trash2, Save, Loader2, Gift,
} from "lucide-react";

interface MentorStats {
  totalSesi: number;
  totalMenit: number;
  totalJam: number;
  totalFee: number;
  totalTransport: number;
  totalBonus: number;
  totalHonor: number;
  laporanCount: number;
  jumlahSiswa: number;
}

interface Presensi {
  id: string;
  tanggal: string;
  jamMasuk: string;
  durasiMenit: number;
  catatan: string | null;
  siswa: { namaLengkap: string } | null;
}

interface SesiPerSiswa {
  siswaId: string;
  nama: string;
  jenjang: string;
  kelas: string;
  count: number;
  fee: number;
  transport: number;
  totalFee: number;
  totalTransport: number;
}

interface JadwalItem {
  id: string;
  hariMengajar: string[];
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string[];
  feeMengajar: string;
  transportFee: string;
  siswa: { namaLengkap: string; jenjang: string; kelas: string };
}

interface Bonus {
  id: string;
  bulan: number;
  tahun: number;
  jumlah: string;
  keterangan: string | null;
}

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export default function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<{ nama: string; email: string; noHp: string | null } | null>(null);
  const [stats, setStats] = useState<MentorStats | null>(null);
  const [presensi, setPresensi] = useState<Presensi[]>([]);
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [bonus, setBonus] = useState<Bonus[]>([]);
  const [sesiPerSiswa, setSesiPerSiswa] = useState<SesiPerSiswa[]>([]);
  const [feeEdits, setFeeEdits] = useState<Record<string, { fee: string; transport: string }>>({});
  const [savingFee, setSavingFee] = useState<string | null>(null);
  const [showBonusForm, setShowBonusForm] = useState(false);
  const [bonusAmount, setBonusAmount] = useState("");
  const [bonusKet, setBonusKet] = useState("");
  const [bonusLoading, setBonusLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mentor/${id}?bulan=${bulan}&tahun=${tahun}`);
      if (res.ok) {
        const d = await res.json();
        setMentor(d.data.mentor);
        setStats(d.data.stats);
        setPresensi(d.data.presensi);
        setJadwal(d.data.jadwal);
        setBonus(d.data.bonus);
        setSesiPerSiswa(d.data.sesiPerSiswa || []);
        // Init fee edits
        const edits: Record<string, { fee: string; transport: string }> = {};
        for (const j of d.data.jadwal) {
          edits[j.id] = { fee: String(Number(j.feeMengajar)), transport: String(Number(j.transportFee)) };
        }
        setFeeEdits(edits);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [bulan, tahun]);

  const handleSaveFee = async (jadwalId: string) => {
    setSavingFee(jadwalId);
    try {
      await fetch(`/api/jadwal/${jadwalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeMengajar: parseFloat(feeEdits[jadwalId]?.fee || "0"),
          transportFee: parseFloat(feeEdits[jadwalId]?.transport || "0"),
        }),
      });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSavingFee(null); }
  };

  const handleAddBonus = async () => {
    if (!bonusAmount) return;
    setBonusLoading(true);
    try {
      await fetch(`/api/mentor/${id}/bonus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulan, tahun, jumlah: parseFloat(bonusAmount), keterangan: bonusKet || null }),
      });
      setBonusAmount(""); setBonusKet(""); setShowBonusForm(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setBonusLoading(false); }
  };

  const handleDeleteBonus = async (bonusId: string) => {
    try {
      await fetch(`/api/mentor/${id}/bonus?bonusId=${bonusId}`, { method: "DELETE" });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const cardStyle: React.CSSProperties = { background: "white", borderRadius: "16px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", padding: "1.25rem" };
  const inputStyle: React.CSSProperties = { padding: "0.5rem 0.75rem", border: "2px solid var(--color-neutral-200)", borderRadius: "8px", fontSize: "0.8125rem", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  if (loading && !mentor) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Memuat...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => router.back()} style={{ background: "white", border: "1px solid var(--color-neutral-200)", borderRadius: "10px", padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }}>{mentor?.nama}</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{mentor?.email} {mentor?.noHp && `• ${mentor.noHp}`}</p>
        </div>
      </div>

      {/* Month/Year filter */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} style={{ padding: "0.5rem 0.75rem", border: "2px solid var(--color-neutral-200)", borderRadius: "10px", fontSize: "0.875rem", background: "white" }}>
          {BULAN.map((n, i) => <option key={i} value={i + 1}>{n}</option>)}
        </select>
        <input type="number" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} min={2024} max={2030} style={{ padding: "0.5rem 0.75rem", border: "2px solid var(--color-neutral-200)", borderRadius: "10px", fontSize: "0.875rem", width: "90px" }} />
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Total Sesi", value: stats.totalSesi, icon: ClipboardCheck, color: "var(--color-primary-500)" },
            { label: "Total Jam", value: `${stats.totalJam}j`, icon: Clock, color: "#6366f1" },
            { label: "Siswa Aktif", value: stats.jumlahSiswa, icon: Users, color: "var(--color-gold-500)" },
            { label: "Laporan", value: stats.laporanCount, icon: FileText, color: "#ec4899" },
          ].map((s, i) => (
            <div key={i} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-outfit)" }}>{s.value}</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Honor Summary */}
      {stats && (
        <div style={{ ...cardStyle, marginBottom: "1.5rem", background: "linear-gradient(135deg, var(--color-primary-50), var(--color-gold-50))", border: "1px solid var(--color-primary-200)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <DollarSign size={18} style={{ color: "var(--color-primary-600)" }} /> Kalkulasi Honor — {BULAN[bulan - 1]} {tahun}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Fee Mengajar</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700 }}>{formatRp(stats.totalFee)}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>{stats.totalSesi} sesi</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Transport</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700 }}>{formatRp(stats.totalTransport)}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Bonus</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-gold-600)" }}>{formatRp(stats.totalBonus)}</div>
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "0.75rem", border: "2px solid var(--color-primary-300)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-primary-600)", marginBottom: "0.25rem", fontWeight: 600 }}>TOTAL HONOR</div>
              <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--color-primary-700)", fontFamily: "var(--font-outfit)" }}>{formatRp(stats.totalHonor)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Sesi per Siswa — Rekap */}
      {sesiPerSiswa.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>📊 Rekap Sesi per Siswa — {BULAN[bulan - 1]}</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Siswa", "Jenjang", "Sesi", "Fee/Sesi", "Transport/Sesi", "Total Fee", "Total Transport", "Subtotal"].map((h) => (
                    <th key={h} style={{ padding: "0.625rem 0.75rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sesiPerSiswa.map((s) => (
                  <tr key={s.siswaId} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600 }}>{s.nama}</td>
                    <td style={{ padding: "0.625rem 0.75rem" }}><span style={{ padding: "0.125rem 0.5rem", background: "#ede9fe", color: "#6d28d9", borderRadius: "6px", fontSize: "0.6875rem", fontWeight: 600 }}>{s.jenjang}-{s.kelas}</span></td>
                    <td style={{ padding: "0.625rem 0.75rem" }}><span style={{ padding: "0.125rem 0.5rem", background: "var(--color-primary-50)", color: "var(--color-primary-700)", borderRadius: "6px", fontWeight: 700 }}>{s.count}x</span></td>
                    <td style={{ padding: "0.625rem 0.75rem" }}>{formatRp(s.fee)}</td>
                    <td style={{ padding: "0.625rem 0.75rem" }}>{formatRp(s.transport)}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600 }}>{formatRp(s.totalFee)}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600 }}>{formatRp(s.totalTransport)}</td>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: "var(--color-primary-700)" }}>{formatRp(s.totalFee + s.totalTransport)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fee Settings per Siswa */}
      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>⚙️ Fee per Siswa</h3>
        {jadwal.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Belum ada jadwal aktif.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {jadwal.map((j) => (
              <div key={j.id} style={{ padding: "0.875rem", background: "var(--bg-secondary)", borderRadius: "12px", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{j.siswa.namaLengkap}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{j.siswa.jenjang}-{j.siswa.kelas} • {j.mataPelajaran.join(", ")}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{j.hariMengajar.join(", ")} • {j.jamMulai}—{j.jamSelesai}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", display: "block" }}>Fee/sesi</label>
                    <input type="number" value={feeEdits[j.id]?.fee || "0"} onChange={(e) => setFeeEdits((p) => ({ ...p, [j.id]: { ...p[j.id], fee: e.target.value } }))} style={{ ...inputStyle, width: "100px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", display: "block" }}>Transport</label>
                    <input type="number" value={feeEdits[j.id]?.transport || "0"} onChange={(e) => setFeeEdits((p) => ({ ...p, [j.id]: { ...p[j.id], transport: e.target.value } }))} style={{ ...inputStyle, width: "100px" }} />
                  </div>
                  <button onClick={() => handleSaveFee(j.id)} disabled={savingFee === j.id} style={{ marginTop: "auto", padding: "0.5rem", background: "var(--color-primary-500)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    {savingFee === j.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bonus Section */}
      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Gift size={18} style={{ color: "var(--color-gold-500)" }} /> Bonus {BULAN[bulan - 1]}
          </h3>
          <button onClick={() => setShowBonusForm(!showBonusForm)} style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem", fontWeight: 600, color: "white", background: "var(--color-gold-500)", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Plus size={14} /> Tambah Bonus
          </button>
        </div>

        {showBonusForm && (
          <div style={{ padding: "1rem", background: "var(--bg-secondary)", borderRadius: "12px", marginBottom: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "0 0 120px" }}>
              <label style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Jumlah (Rp)</label>
              <input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} style={inputStyle} placeholder="50000" />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.25rem" }}>Keterangan</label>
              <input value={bonusKet} onChange={(e) => setBonusKet(e.target.value)} style={inputStyle} placeholder="Bonus lembur, THR, dll" />
            </div>
            <button onClick={handleAddBonus} disabled={bonusLoading} style={{ padding: "0.5rem 1rem", background: "var(--color-gold-500)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.8125rem" }}>
              {bonusLoading ? "..." : "Simpan"}
            </button>
          </div>
        )}

        {bonus.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Belum ada bonus untuk bulan ini.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {bonus.map((b) => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0.875rem", background: "var(--bg-secondary)", borderRadius: "10px" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{formatRp(Number(b.jumlah))}</span>
                  {b.keterangan && <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginLeft: "0.75rem" }}>— {b.keterangan}</span>}
                </div>
                <button onClick={() => handleDeleteBonus(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "0.25rem" }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Presensi Table */}
      <div style={{ ...cardStyle, overflow: "hidden", padding: 0 }}>
        <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--color-neutral-100)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>📋 Riwayat Presensi — {BULAN[bulan - 1]} {tahun}</h3>
        </div>
        {presensi.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>Belum ada presensi bulan ini.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Tanggal", "Hari", "Siswa", "Jam", "Durasi", "Catatan"].map((h) => (
                    <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {presensi.map((p) => {
                  const d = new Date(p.tanggal);
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--color-neutral-100)" }}>
                      <td style={{ padding: "0.625rem 0.875rem", fontWeight: 500 }}>{d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</td>
                      <td style={{ padding: "0.625rem 0.875rem", color: "var(--text-secondary)" }}>{d.toLocaleDateString("id-ID", { weekday: "long" })}</td>
                      <td style={{ padding: "0.625rem 0.875rem" }}>{p.siswa ? <span style={{ padding: "0.125rem 0.5rem", background: "#ede9fe", color: "#6d28d9", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{p.siswa.namaLengkap}</span> : <span style={{ color: "var(--text-secondary)" }}>—</span>}</td>
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
