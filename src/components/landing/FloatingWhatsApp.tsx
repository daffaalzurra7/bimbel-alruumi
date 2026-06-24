"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const waNumber = "6285640817894";

  return (
    <a
      id="floating-whatsapp"
      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
        "Assalamualaikum, saya ingin bertanya tentang Bimbel Al Ruumi."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textDecoration: "none",
        zIndex: 40,
        boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
        transition: "all 0.3s ease",
      }}
      className="animate-pulse-glow"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 30px rgba(37, 211, 102, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(37, 211, 102, 0.4)";
      }}
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
}
