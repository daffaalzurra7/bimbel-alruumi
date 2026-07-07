"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Save, Loader2, Check, ChevronRight,
  Eye, Target, GraduationCap, Star, ScrollText, Phone,
  Plus, Trash2, GripVertical,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================
interface ContentEntry {
  id: string;
  section: string;
  key: string;
  value: unknown;
  updatedAt: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabConfig[] = [
  { id: "hero", label: "Hero", icon: Eye, description: "Headline, sub-headline, badge, stats, WhatsApp" },
  { id: "visi_misi", label: "Visi & Misi", icon: Target, description: "Visi text dan daftar misi" },
  { id: "program", label: "Program", icon: GraduationCap, description: "Daftar program belajar (kartu)" },
  { id: "keunggulan", label: "Keunggulan", icon: Star, description: "Daftar keunggulan bimbel" },
  { id: "aturan", label: "Aturan", icon: ScrollText, description: "Accordion aturan & ketentuan" },
  { id: "footer", label: "Footer", icon: Phone, description: "Kontak, sosial media, deskripsi" },
];

// ============================================================
// MAIN PAGE
// ============================================================
export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [allContent, setAllContent] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/cms");
      if (res.ok) {
        const data = await res.json();
        setAllContent(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const sectionContent = allContent.filter(e => e.section === activeTab);

  const getVal = (key: string): unknown => {
    const entry = sectionContent.find(e => e.key === key);
    return entry?.value ?? "";
  };

  const setVal = (key: string, value: unknown) => {
    setAllContent(prev => {
      const idx = prev.findIndex(e => e.section === activeTab && e.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], value };
        return next;
      }
      return [...prev, { id: "", section: activeTab, key, value, updatedAt: "" }];
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const entries = sectionContent.map(e => ({ key: e.key, value: e.value }));
      const res = await fetch(`/api/cms/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error?.message || "Gagal menyimpan");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchContent();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  };

  // Shared styles
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem",
    border: "2px solid var(--color-neutral-200)", borderRadius: "12px",
    fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
    boxSizing: "border-box", transition: "border-color 0.2s ease",
  };
  const textareaStyle: React.CSSProperties = {
    ...inputStyle, minHeight: "80px", resize: "vertical", lineHeight: 1.7,
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.8125rem", fontWeight: 600,
    color: "var(--text-primary)", marginBottom: "0.5rem",
  };
  const hintStyle: React.CSSProperties = {
    fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={24} style={{ color: "var(--color-primary-500)" }} />
            Kelola Konten Landing Page
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Edit teks, statistik, program, dan informasi yang tampil di halaman utama website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.75rem 1.5rem", fontWeight: 700, color: "white",
            background: saved
              ? "linear-gradient(135deg, #059669, #047857)"
              : saving
                ? "var(--color-neutral-400)"
                : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))",
            border: "none", borderRadius: "12px",
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem",
            boxShadow: saved ? "0 4px 14px rgba(5,150,105,0.35)" : "0 4px 14px rgba(13,146,85,0.35)",
            transition: "all 0.3s ease",
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Tab Navigation + Content */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Sidebar Tabs */}
        <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-neutral-100)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Section
            </span>
          </div>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem 1.25rem", border: "none", cursor: "pointer",
                  background: isActive ? "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))" : "transparent",
                  borderLeft: isActive ? "3px solid var(--color-primary-500)" : "3px solid transparent",
                  transition: "all 0.2s ease", textAlign: "left",
                }}
              >
                <tab.icon size={18} style={{ color: isActive ? "var(--color-primary-600)" : "var(--text-muted)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: isActive ? 700 : 500, color: isActive ? "var(--color-primary-700)" : "var(--text-primary)" }}>
                    {tab.label}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tab.description}
                  </div>
                </div>
                {isActive && <ChevronRight size={14} style={{ color: "var(--color-primary-500)", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {/* Content Editor */}
        <div style={{ background: "white", borderRadius: "20px", border: "1px solid var(--color-neutral-100)", boxShadow: "var(--shadow-sm)", padding: "1.5rem" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 0.5rem" }} />
              Memuat konten...
            </div>
          ) : (
            <>
              {activeTab === "hero" && <HeroEditor getVal={getVal} setVal={setVal} inputStyle={inputStyle} textareaStyle={textareaStyle} labelStyle={labelStyle} hintStyle={hintStyle} />}
              {activeTab === "visi_misi" && <VisiMisiEditor getVal={getVal} setVal={setVal} inputStyle={inputStyle} textareaStyle={textareaStyle} labelStyle={labelStyle} hintStyle={hintStyle} />}
              {activeTab === "program" && <ProgramEditor getVal={getVal} setVal={setVal} inputStyle={inputStyle} textareaStyle={textareaStyle} labelStyle={labelStyle} hintStyle={hintStyle} />}
              {activeTab === "keunggulan" && <KeunggulanEditor getVal={getVal} setVal={setVal} inputStyle={inputStyle} textareaStyle={textareaStyle} labelStyle={labelStyle} hintStyle={hintStyle} />}
              {activeTab === "aturan" && <AturanEditor getVal={getVal} setVal={setVal} inputStyle={inputStyle} textareaStyle={textareaStyle} labelStyle={labelStyle} hintStyle={hintStyle} />}
              {activeTab === "footer" && <FooterEditor getVal={getVal} setVal={setVal} inputStyle={inputStyle} textareaStyle={textareaStyle} labelStyle={labelStyle} hintStyle={hintStyle} />}
            </>
          )}
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .cms-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// EDITOR PROPS
// ============================================================
interface EditorProps {
  getVal: (key: string) => unknown;
  setVal: (key: string, value: unknown) => void;
  inputStyle: React.CSSProperties;
  textareaStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  hintStyle: React.CSSProperties;
}

// ============================================================
// SECTION HEADER
// ============================================================
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--color-neutral-100)" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif", color: "var(--text-primary)" }}>{title}</h2>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{subtitle}</p>
    </div>
  );
}

// ============================================================
// HERO EDITOR
// ============================================================
function HeroEditor({ getVal, setVal, inputStyle, textareaStyle, labelStyle, hintStyle }: EditorProps) {
  const stats = (getVal("stats") || []) as Array<{ icon: string; value: string; label: string }>;

  return (
    <div>
      <SectionHeader title="Hero Section" subtitle="Konten utama yang pertama kali dilihat pengunjung" />
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <label style={labelStyle}>Badge Text</label>
          <input style={inputStyle} value={String(getVal("badge_text") || "")} onChange={e => setVal("badge_text", e.target.value)} placeholder="Bimbingan Belajar dengan Nilai Islami" />
          <p style={hintStyle}>Label kecil di atas headline (contoh: &quot;🕌 Bimbingan Belajar...&quot;)</p>
        </div>
        <div>
          <label style={labelStyle}>Headline</label>
          <input style={inputStyle} value={String(getVal("headline") || "")} onChange={e => setVal("headline", e.target.value)} placeholder="Bimbing Masa Depan Cemerlang Putra-Putri Anda" />
        </div>
        <div>
          <label style={labelStyle}>Kata yang Di-Highlight (Warna Emas)</label>
          <input style={inputStyle} value={String(getVal("headline_highlight") || "")} onChange={e => setVal("headline_highlight", e.target.value)} placeholder="Cemerlang" />
          <p style={hintStyle}>Kata dari headline yang akan diberi warna emas</p>
        </div>
        <div>
          <label style={labelStyle}>Sub-Headline</label>
          <textarea style={textareaStyle} value={String(getVal("subheadline") || "")} onChange={e => setVal("subheadline", e.target.value)} rows={3} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Nomor WhatsApp</label>
            <input style={inputStyle} value={String(getVal("wa_number") || "")} onChange={e => setVal("wa_number", e.target.value)} placeholder="6285640817894" />
            <p style={hintStyle}>Format: 62xxx (tanpa +)</p>
          </div>
          <div>
            <label style={labelStyle}>Pesan WhatsApp</label>
            <input style={inputStyle} value={String(getVal("wa_message") || "")} onChange={e => setVal("wa_message", e.target.value)} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Tombol Utama (CTA)</label>
            <input style={inputStyle} value={String(getVal("cta_primary") || "")} onChange={e => setVal("cta_primary", e.target.value)} placeholder="Daftar via WhatsApp" />
          </div>
          <div>
            <label style={labelStyle}>Tombol Sekunder</label>
            <input style={inputStyle} value={String(getVal("cta_secondary") || "")} onChange={e => setVal("cta_secondary", e.target.value)} placeholder="Lihat Program" />
          </div>
        </div>

        {/* Stats */}
        <div>
          <label style={labelStyle}>Statistik</label>
          <p style={hintStyle}>Angka-angka yang tampil di bawah tombol CTA</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 40px", gap: "0.5rem", alignItems: "center" }}>
                <input style={inputStyle} value={stat.value} onChange={e => {
                  const next = [...stats]; next[i] = { ...next[i], value: e.target.value }; setVal("stats", next);
                }} placeholder="500+" />
                <input style={inputStyle} value={stat.label} onChange={e => {
                  const next = [...stats]; next[i] = { ...next[i], label: e.target.value }; setVal("stats", next);
                }} placeholder="Siswa Aktif" />
                <button onClick={() => { const next = stats.filter((_, j) => j !== i); setVal("stats", next); }} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => setVal("stats", [...stats, { icon: "Star", value: "", label: "" }])} style={{ padding: "0.5rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "10px", background: "transparent", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
              <Plus size={14} /> Tambah Statistik
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// VISI MISI EDITOR
// ============================================================
function VisiMisiEditor({ getVal, setVal, inputStyle, textareaStyle, labelStyle, hintStyle }: EditorProps) {
  const misiItems = (getVal("misi_items") || []) as string[];

  return (
    <div>
      <SectionHeader title="Visi & Misi" subtitle="Landasan dan tujuan bimbel" />
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <label style={labelStyle}>Badge Section</label>
          <input style={inputStyle} value={String(getVal("section_badge") || "")} onChange={e => setVal("section_badge", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Judul Section</label>
            <input style={inputStyle} value={String(getVal("section_title") || "")} onChange={e => setVal("section_title", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Kata Highlight</label>
            <input style={inputStyle} value={String(getVal("section_title_highlight") || "")} onChange={e => setVal("section_title_highlight", e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Subtitle Section</label>
          <input style={inputStyle} value={String(getVal("section_subtitle") || "")} onChange={e => setVal("section_subtitle", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Teks Visi</label>
          <textarea style={textareaStyle} value={String(getVal("visi_text") || "")} onChange={e => setVal("visi_text", e.target.value)} rows={4} />
        </div>
        <div>
          <label style={labelStyle}>Daftar Misi</label>
          <p style={hintStyle}>Point-point misi yang tampil di kartu misi</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem" }}>
            {misiItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <GripVertical size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <input style={{ ...inputStyle, flex: 1 }} value={item} onChange={e => {
                  const next = [...misiItems]; next[i] = e.target.value; setVal("misi_items", next);
                }} />
                <button onClick={() => { const next = misiItems.filter((_, j) => j !== i); setVal("misi_items", next); }} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => setVal("misi_items", [...misiItems, ""])} style={{ padding: "0.5rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "10px", background: "transparent", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
              <Plus size={14} /> Tambah Misi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROGRAM EDITOR
// ============================================================
interface ProgramItem {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  subjects: string[];
  color: string;
  colorLight: string;
  waMessage: string;
}

const ICON_OPTIONS = [
  "BookOpen", "PenTool", "Calculator", "Target", "Atom", "Trophy", "Languages",
  "GraduationCap", "Star", "Award", "Sparkles", "FileText",
];

function ProgramEditor({ getVal, setVal, inputStyle, textareaStyle, labelStyle, hintStyle }: EditorProps) {
  const programs = (getVal("programs") || []) as ProgramItem[];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const updateProgram = (index: number, field: keyof ProgramItem, value: unknown) => {
    const next = [...programs];
    next[index] = { ...next[index], [field]: value };
    setVal("programs", next);
  };

  const addProgram = () => {
    setVal("programs", [...programs, {
      title: "Program Baru", subtitle: "", description: "", icon: "BookOpen",
      subjects: [], color: "#0d9255", colorLight: "#ecfdf5", waMessage: "",
    }]);
    setExpandedIdx(programs.length);
  };

  const removeProgram = (index: number) => {
    setVal("programs", programs.filter((_, i) => i !== index));
    setExpandedIdx(null);
  };

  return (
    <div>
      <SectionHeader title="Program Belajar" subtitle="Daftar kartu program yang tampil di landing page" />

      {/* Section header fields */}
      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Badge Section</label>
            <input style={inputStyle} value={String(getVal("section_badge") || "")} onChange={e => setVal("section_badge", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Kata Highlight</label>
            <input style={inputStyle} value={String(getVal("section_title_highlight") || "")} onChange={e => setVal("section_title_highlight", e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Subtitle Section</label>
          <input style={inputStyle} value={String(getVal("section_subtitle") || "")} onChange={e => setVal("section_subtitle", e.target.value)} />
        </div>
      </div>

      {/* Program Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {programs.map((prog, i) => (
          <div key={i} style={{
            border: expandedIdx === i ? "2px solid var(--color-primary-300)" : "1px solid var(--color-neutral-200)",
            borderRadius: "16px", overflow: "hidden", transition: "all 0.2s ease",
          }}>
            {/* Collapsed header */}
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "1rem 1.25rem", background: expandedIdx === i ? "var(--color-primary-50)" : "white",
                border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: prog.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{prog.title || "Program Baru"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{prog.subtitle}</div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)", transform: expandedIdx === i ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
            </button>

            {/* Expanded form */}
            {expandedIdx === i && (
              <div style={{ padding: "1.25rem", borderTop: "1px solid var(--color-neutral-100)", display: "grid", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div><label style={labelStyle}>Judul Program</label><input style={inputStyle} value={prog.title} onChange={e => updateProgram(i, "title", e.target.value)} /></div>
                  <div><label style={labelStyle}>Subtitle</label><input style={inputStyle} value={prog.subtitle} onChange={e => updateProgram(i, "subtitle", e.target.value)} /></div>
                </div>
                <div><label style={labelStyle}>Deskripsi</label><textarea style={textareaStyle} value={prog.description} onChange={e => updateProgram(i, "description", e.target.value)} rows={3} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Icon</label>
                    <select style={{ ...inputStyle, background: "white" }} value={prog.icon} onChange={e => updateProgram(i, "icon", e.target.value)}>
                      {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Warna Utama</label><input style={inputStyle} type="color" value={prog.color} onChange={e => updateProgram(i, "color", e.target.value)} /></div>
                  <div><label style={labelStyle}>Warna Latar</label><input style={inputStyle} type="color" value={prog.colorLight} onChange={e => updateProgram(i, "colorLight", e.target.value)} /></div>
                </div>
                <div>
                  <label style={labelStyle}>Mata Pelajaran (pisah dengan koma)</label>
                  <input style={inputStyle} value={(prog.subjects || []).join(", ")} onChange={e => updateProgram(i, "subjects", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
                  <p style={hintStyle}>Contoh: Matematika, IPA, B. Indonesia</p>
                </div>
                <div>
                  <label style={labelStyle}>Pesan WhatsApp</label>
                  <input style={inputStyle} value={prog.waMessage} onChange={e => updateProgram(i, "waMessage", e.target.value)} />
                </div>
                <button onClick={() => removeProgram(i)} style={{ padding: "0.5rem 1rem", border: "1px solid #fecaca", borderRadius: "10px", background: "#fef2f2", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", width: "fit-content" }}>
                  <Trash2 size={14} /> Hapus Program
                </button>
              </div>
            )}
          </div>
        ))}

        <button onClick={addProgram} style={{ padding: "0.875rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "14px", background: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
          <Plus size={16} /> Tambah Program Baru
        </button>
      </div>
    </div>
  );
}

// ============================================================
// KEUNGGULAN EDITOR
// ============================================================
interface KeunggulanItem {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

function KeunggulanEditor({ getVal, setVal, inputStyle, textareaStyle, labelStyle, hintStyle }: EditorProps) {
  const items = (getVal("items") || []) as KeunggulanItem[];

  const updateItem = (index: number, field: keyof KeunggulanItem, value: string) => {
    const next = [...items]; next[index] = { ...next[index], [field]: value }; setVal("items", next);
  };

  return (
    <div>
      <SectionHeader title="Keunggulan" subtitle="Daftar keunggulan yang membedakan bimbel dari kompetitor" />
      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Badge Section</label><input style={inputStyle} value={String(getVal("section_badge") || "")} onChange={e => setVal("section_badge", e.target.value)} /></div>
          <div><label style={labelStyle}>Kata Highlight</label><input style={inputStyle} value={String(getVal("section_title_highlight") || "")} onChange={e => setVal("section_title_highlight", e.target.value)} /></div>
        </div>
        <div><label style={labelStyle}>Judul Section</label><input style={inputStyle} value={String(getVal("section_title") || "")} onChange={e => setVal("section_title", e.target.value)} /></div>
        <div><label style={labelStyle}>Subtitle Section</label><input style={inputStyle} value={String(getVal("section_subtitle") || "")} onChange={e => setVal("section_subtitle", e.target.value)} /></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ border: "1px solid var(--color-neutral-200)", borderRadius: "14px", padding: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 40px", gap: "0.75rem", alignItems: "start" }}>
              <div><label style={labelStyle}>Judul</label><input style={inputStyle} value={item.title} onChange={e => updateItem(i, "title", e.target.value)} /></div>
              <div>
                <label style={labelStyle}>Icon</label>
                <select style={{ ...inputStyle, background: "white" }} value={item.icon} onChange={e => updateItem(i, "icon", e.target.value)}>
                  {[...ICON_OPTIONS, "Shield", "BarChart3", "HeartHandshake", "Clock", "BookMarked"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <button onClick={() => setVal("items", items.filter((_, j) => j !== i))} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1.5rem" }}>
                <Trash2 size={14} />
              </button>
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <label style={labelStyle}>Deskripsi</label>
              <textarea style={{ ...textareaStyle, minHeight: "60px" }} value={item.description} onChange={e => updateItem(i, "description", e.target.value)} rows={2} />
            </div>
          </div>
        ))}
        <button onClick={() => setVal("items", [...items, { icon: "Star", title: "", description: "", gradient: "linear-gradient(135deg, #0d9255, #065f36)" }])} style={{ padding: "0.875rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "14px", background: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
          <Plus size={16} /> Tambah Keunggulan
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ATURAN EDITOR
// ============================================================
interface AturanItem {
  title: string;
  content: string[];
}

function AturanEditor({ getVal, setVal, inputStyle, textareaStyle, labelStyle, hintStyle }: EditorProps) {
  const items = (getVal("items") || []) as AturanItem[];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const updateItem = (index: number, field: keyof AturanItem, value: unknown) => {
    const next = [...items]; next[index] = { ...next[index], [field]: value }; setVal("items", next);
  };

  return (
    <div>
      <SectionHeader title="Aturan & Ketentuan" subtitle="Accordion FAQ/aturan yang tampil di landing page" />
      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div><label style={labelStyle}>Badge Section</label><input style={inputStyle} value={String(getVal("section_badge") || "")} onChange={e => setVal("section_badge", e.target.value)} /></div>
          <div><label style={labelStyle}>Kata Highlight</label><input style={inputStyle} value={String(getVal("section_title_highlight") || "")} onChange={e => setVal("section_title_highlight", e.target.value)} /></div>
        </div>
        <div><label style={labelStyle}>Subtitle Section</label><input style={inputStyle} value={String(getVal("section_subtitle") || "")} onChange={e => setVal("section_subtitle", e.target.value)} /></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            border: expandedIdx === i ? "2px solid var(--color-gold-300)" : "1px solid var(--color-neutral-200)",
            borderRadius: "16px", overflow: "hidden",
          }}>
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem", background: expandedIdx === i ? "var(--color-gold-50)" : "white", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: expandedIdx === i ? "var(--color-gold-500)" : "var(--color-neutral-200)", color: expandedIdx === i ? "white" : "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600 }}>{item.title || "Aturan Baru"}</div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)", transform: expandedIdx === i ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
            </button>
            {expandedIdx === i && (
              <div style={{ padding: "1.25rem", borderTop: "1px solid var(--color-neutral-100)", display: "grid", gap: "1rem" }}>
                <div><label style={labelStyle}>Judul Accordion</label><input style={inputStyle} value={item.title} onChange={e => updateItem(i, "title", e.target.value)} /></div>
                <div>
                  <label style={labelStyle}>Butir-butir Aturan</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {item.content.map((point, j) => (
                      <div key={j} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0, width: "16px" }}>{j + 1}.</span>
                        <input style={{ ...inputStyle, flex: 1 }} value={point} onChange={e => {
                          const next = [...item.content]; next[j] = e.target.value; updateItem(i, "content", next);
                        }} />
                        <button onClick={() => { const next = item.content.filter((_, k) => k !== j); updateItem(i, "content", next); }} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => updateItem(i, "content", [...item.content, ""])} style={{ padding: "0.375rem 0.75rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "8px", background: "transparent", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem", justifyContent: "center" }}>
                      <Plus size={12} /> Tambah Butir
                    </button>
                  </div>
                </div>
                <button onClick={() => { setVal("items", items.filter((_, j) => j !== i)); setExpandedIdx(null); }} style={{ padding: "0.5rem 1rem", border: "1px solid #fecaca", borderRadius: "10px", background: "#fef2f2", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem", width: "fit-content" }}>
                  <Trash2 size={14} /> Hapus Aturan
                </button>
              </div>
            )}
          </div>
        ))}
        <button onClick={() => { setVal("items", [...items, { title: "", content: [""] }]); setExpandedIdx(items.length); }} style={{ padding: "0.875rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "14px", background: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
          <Plus size={16} /> Tambah Aturan Baru
        </button>
      </div>
    </div>
  );
}

// ============================================================
// FOOTER EDITOR
// ============================================================
interface ContactItem { icon: string; text: string; }
interface SocialLink { icon: string; href: string; label: string; }

function FooterEditor({ getVal, setVal, inputStyle, textareaStyle, labelStyle, hintStyle }: EditorProps) {
  const contacts = (getVal("contact_info") || []) as ContactItem[];
  const socials = (getVal("social_links") || []) as SocialLink[];

  return (
    <div>
      <SectionHeader title="Footer" subtitle="Kontak, social media, deskripsi, dan Google Maps" />
      <div style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <label style={labelStyle}>Deskripsi Bimbel</label>
          <textarea style={textareaStyle} value={String(getVal("description") || "")} onChange={e => setVal("description", e.target.value)} rows={3} />
        </div>

        {/* Contact Info */}
        <div>
          <label style={labelStyle}>Informasi Kontak</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 40px", gap: "0.5rem", alignItems: "center" }}>
                <select style={{ ...inputStyle, background: "white", fontSize: "0.75rem" }} value={c.icon} onChange={e => {
                  const next = [...contacts]; next[i] = { ...next[i], icon: e.target.value }; setVal("contact_info", next);
                }}>
                  {["MapPin", "Phone", "Mail", "Clock"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input style={inputStyle} value={c.text} onChange={e => {
                  const next = [...contacts]; next[i] = { ...next[i], text: e.target.value }; setVal("contact_info", next);
                }} />
                <button onClick={() => setVal("contact_info", contacts.filter((_, j) => j !== i))} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => setVal("contact_info", [...contacts, { icon: "Phone", text: "" }])} style={{ padding: "0.5rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "10px", background: "transparent", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
              <Plus size={14} /> Tambah Kontak
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label style={labelStyle}>Social Media</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            {socials.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 40px", gap: "0.5rem", alignItems: "center" }}>
                <input style={{ ...inputStyle, fontSize: "0.8125rem" }} value={s.label} onChange={e => {
                  const next = [...socials]; next[i] = { ...next[i], label: e.target.value }; setVal("social_links", next);
                }} placeholder="Label" />
                <input style={inputStyle} value={s.href} onChange={e => {
                  const next = [...socials]; next[i] = { ...next[i], href: e.target.value }; setVal("social_links", next);
                }} placeholder="URL" />
                <select style={{ ...inputStyle, background: "white" }} value={s.icon} onChange={e => {
                  const next = [...socials]; next[i] = { ...next[i], icon: e.target.value }; setVal("social_links", next);
                }}>
                  {["Globe", "Video", "Phone", "Mail"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <button onClick={() => setVal("social_links", socials.filter((_, j) => j !== i))} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", color: "#dc2626", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => setVal("social_links", [...socials, { icon: "Globe", href: "", label: "" }])} style={{ padding: "0.5rem 1rem", border: "2px dashed var(--color-neutral-300)", borderRadius: "10px", background: "transparent", cursor: "pointer", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
              <Plus size={14} /> Tambah Social Media
            </button>
          </div>
        </div>

        {/* Map Embed URL */}
        <div>
          <label style={labelStyle}>URL Google Maps Embed</label>
          <input style={inputStyle} value={String(getVal("map_embed_url") || "")} onChange={e => setVal("map_embed_url", e.target.value)} />
          <p style={hintStyle}>URL embed dari Google Maps (bukan link biasa)</p>
        </div>

        <div>
          <label style={labelStyle}>Teks Tambahan Footer</label>
          <input style={inputStyle} value={String(getVal("copyright_extra") || "")} onChange={e => setVal("copyright_extra", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
