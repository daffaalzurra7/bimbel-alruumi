"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ClipboardCheck,
  Clock,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface Presensi {
  id: string;
  tanggal: string;
  jamMasuk: string;
  durasiMenit: number;
  catatan: string | null;
  createdAt: string;
}

export default function PresensiPage() {
  const { data: session } = useSession();
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jamMasuk, setJamMasuk] = useState(
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [durasi, setDurasi] = useState<number>(60);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [riwayat, setRiwayat] = useState<Presensi[]>([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);

  const durasiOptions = [
    { value: 60, label: "60 mnt" },
    { value: 90, label: "90 mnt" },
    { value: 120, label: "120 mnt" },
  ];

  // Fetch riwayat presensi
  const fetchRiwayat = async () => {
    try {
      const res = await fetch("/api/presensi");
      if (res.ok) {
        const data = await res.json();
        setRiwayat(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching riwayat:", err);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/presensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tanggal, jamMasuk, durasiMenit: durasi, catatan: catatan || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Gagal menyimpan presensi");
        return;
      }

      setSuccess(true);
      setCatatan("");
      fetchRiwayat();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus presensi ini?")) return;

    try {
      const res = await fetch(`/api/presensi/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRiwayat();
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-outfit), sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ClipboardCheck size={24} style={{ color: "var(--color-primary-500)" }} />
          Presensi Kerja
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Catat kehadiran mengajar Anda. Bisa presensi berkali-kali per hari untuk setiap sesi.
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid var(--color-neutral-100)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "2rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Tanggal */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                <Calendar size={14} style={{ color: "var(--color-primary-500)" }} />
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid var(--color-neutral-200)",
                  borderRadius: "12px",
                  fontSize: "0.9375rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-500)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-neutral-200)")}
              />
            </div>

            {/* Jam Masuk */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                <Clock size={14} style={{ color: "var(--color-primary-500)" }} />
                Jam Masuk
              </label>
              <input
                type="time"
                value={jamMasuk}
                onChange={(e) => setJamMasuk(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid var(--color-neutral-200)",
                  borderRadius: "12px",
                  fontSize: "0.9375rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-500)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-neutral-200)")}
              />
            </div>

            {/* Durasi */}
            <div>
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Durasi Mengajar
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {durasiOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDurasi(opt.value)}
                    style={{
                      flex: 1,
                      padding: "0.75rem 0.5rem",
                      borderRadius: "12px",
                      border: `2px solid ${
                        durasi === opt.value
                          ? "var(--color-primary-500)"
                          : "var(--color-neutral-200)"
                      }`,
                      background:
                        durasi === opt.value
                          ? "var(--color-primary-50)"
                          : "white",
                      color:
                        durasi === opt.value
                          ? "var(--color-primary-700)"
                          : "var(--text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: durasi === opt.value ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Catatan (opsional)
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Les Matematika bersama Adi, Les Fisika bersama Budi..."
              rows={2}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid var(--color-neutral-200)",
                borderRadius: "12px",
                fontSize: "0.875rem",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-500)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-neutral-200)")}
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                color: "#dc2626",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "var(--color-primary-50)",
                border: "1px solid var(--color-primary-200)",
                borderRadius: "12px",
                color: "var(--color-primary-700)",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CheckCircle2 size={16} />
              Presensi berhasil disimpan!
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.875rem 2rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "white",
              background: loading
                ? "var(--color-neutral-400)"
                : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: loading ? "none" : "0 4px 14px rgba(13, 146, 85, 0.35)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Menyimpan..." : "Simpan Presensi"}
          </button>
        </form>
      </div>

      {/* Riwayat Presensi */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid var(--color-neutral-100)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-neutral-100)",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Riwayat Presensi
          </h2>
        </div>

        {loadingRiwayat ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
            Memuat riwayat...
          </div>
        ) : riwayat.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
            Belum ada data presensi. Mulai isi presensi Anda di atas.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Tanggal", "Hari", "Jam Masuk", "Durasi", "Catatan", "Aksi"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid var(--color-neutral-100)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riwayat.map((item) => {
                  const d = new Date(item.tanggal);
                  const hari = d.toLocaleDateString("id-ID", { weekday: "long" });
                  const tgl = d.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid var(--color-neutral-100)",
                        transition: "background 0.15s",
                      }}
                    >
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 500 }}>{tgl}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--text-secondary)" }}>
                        {hari}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.625rem",
                            background: "var(--color-primary-50)",
                            color: "var(--color-primary-700)",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                          }}
                        >
                          {item.jamMasuk}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.625rem",
                            background: "var(--color-gold-50)",
                            color: "var(--color-gold-700)",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                          }}
                        >
                          {item.durasiMenit} mnt
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          color: "var(--text-secondary)",
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.catatan || "—"}
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#dc2626",
                            padding: "0.25rem",
                          }}
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
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
