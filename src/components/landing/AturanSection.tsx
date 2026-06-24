"use client";

import { useState } from "react";
import { ChevronDown, ScrollText } from "lucide-react";

const aturan = [
  {
    title: "Ketentuan Pendaftaran",
    content: [
      "Pendaftaran dilakukan melalui WhatsApp atau datang langsung ke kantor Bimbel Al Ruumi.",
      "Orang tua/wali wajib mengisi formulir pendaftaran dengan data yang lengkap dan benar.",
      "Biaya pendaftaran dibayarkan saat proses registrasi selesai.",
      "Jadwal belajar disepakati bersama antara orang tua, siswa, dan pihak bimbel.",
    ],
  },
  {
    title: "Aturan Selama Belajar",
    content: [
      "Siswa wajib menyiapkan buku, alat tulis, dan materi yang akan dipelajari sebelum sesi dimulai.",
      "Setiap sesi belajar diawali dengan doa bersama dan diakhiri dengan evaluasi singkat.",
      "Siswa diharapkan mengerjakan tugas/pekerjaan rumah yang diberikan oleh mentor.",
      "Penggunaan handphone selama sesi belajar tidak diperkenankan, kecuali untuk keperluan belajar.",
    ],
  },
  {
    title: "Ketentuan Pembayaran",
    content: [
      "Pembayaran SPP dilakukan di awal bulan, paling lambat tanggal 10 setiap bulannya.",
      "Pembayaran dapat dilakukan via transfer bank atau cash ke kantor.",
      "Bukti pembayaran wajib dikirim melalui WhatsApp untuk verifikasi.",
      "Keterlambatan pembayaran lebih dari 15 hari akan dikenakan notifikasi pengingat.",
    ],
  },
  {
    title: "Kebijakan Izin & Penggantian Jadwal",
    content: [
      "Jika siswa berhalangan hadir, orang tua wajib menginformasikan minimal 3 jam sebelum jadwal.",
      "Penggantian jadwal dapat dilakukan maksimal 2 kali dalam sebulan.",
      "Ketidakhadiran tanpa pemberitahuan (alpa) tidak mendapat penggantian jadwal.",
      "Mentor yang berhalangan akan diganti oleh mentor pengganti yang setara.",
    ],
  },
  {
    title: "Hak & Kewajiban Orang Tua",
    content: [
      "Orang tua berhak mendapatkan laporan perkembangan belajar anak secara berkala.",
      "Orang tua berhak memberikan masukan dan evaluasi terhadap kinerja mentor.",
      "Orang tua wajib menyediakan tempat belajar yang kondusif di rumah.",
      "Komunikasi antara orang tua dan pihak bimbel dilakukan melalui WhatsApp resmi.",
    ],
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof aturan)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      style={{
        background: isOpen ? "var(--color-primary-50)" : "white",
        borderRadius: "16px",
        border: isOpen
          ? "1px solid var(--color-primary-200)"
          : "1px solid var(--color-neutral-100)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: isOpen ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      <button
        id={`aturan-toggle-${index}`}
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: isOpen
                ? "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))"
                : "var(--color-neutral-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isOpen ? "white" : "var(--text-secondary)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              transition: "all 0.3s ease",
            }}
          >
            {index + 1}
          </span>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: isOpen
                ? "var(--color-primary-700)"
                : "var(--text-primary)",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            {item.title}
          </span>
        </span>
        <ChevronDown
          size={20}
          style={{
            color: isOpen
              ? "var(--color-primary-600)"
              : "var(--text-muted)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}
        />
      </button>

      <div
        style={{
          maxHeight: isOpen ? "500px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <ul
          style={{
            padding: "0 1.5rem 1.25rem 4.25rem",
            margin: 0,
            listStyle: "none",
          }}
        >
          {item.content.map((point, i) => (
            <li
              key={i}
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                position: "relative",
                paddingLeft: "1.25rem",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "10px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-primary-300)",
                }}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AturanSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="aturan" className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="container-custom" style={{ maxWidth: "800px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div className="section-badge">
            <ScrollText size={14} />
            Ketentuan
          </div>
          <h2 className="section-title">
            Aturan &{" "}
            <span
              className="gold-underline"
              style={{ color: "var(--color-primary-600)" }}
            >
              Ketentuan
            </span>
          </h2>
          <p className="section-subtitle">
            Aturan yang kami terapkan demi kelancaran dan kualitas proses
            belajar mengajar
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {aturan.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
