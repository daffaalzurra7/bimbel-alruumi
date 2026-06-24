"use client";

import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Video,
} from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="kontak"
      style={{
        background: "linear-gradient(180deg, var(--color-primary-950) 0%, #010d07 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Islamic pattern overlay */}
      <div className="islamic-pattern" style={{ opacity: 0.03 }} />

      {/* Gold top line */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-500), var(--color-gold-400), transparent)",
        }}
      />

      <div
        className="container-custom"
        style={{ padding: "4rem 1.5rem 2rem", position: "relative", zIndex: 1 }}
      >
        {/* Main Footer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/Logo.png"
                  alt="Logo Al Ruumi"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-outfit), sans-serif",
                  }}
                >
                  Al Ruumi
                </span>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginTop: "-2px",
                  }}
                >
                  Bimbingan Belajar
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                maxWidth: "300px",
              }}
            >
              Bimbel Al Ruumi hadir sebagai mitra terpercaya dalam membimbing
              putra-putri Anda belajar dengan landasan nilai
              Islami.
            </p>

            {/* Social Links */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              {[
                { icon: Globe, href: "#", label: "Instagram" },
                { icon: Video, href: "#", label: "YouTube" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                fontFamily: "var(--font-outfit), sans-serif",
                color: "var(--color-gold-400)",
              }}
            >
              Hubungi Kami
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {[
                {
                  icon: MapPin,
                  text: "Jl. Contoh Alamat No. 123, Bekasi, Jawa Barat",
                },
                { icon: Phone, text: "+62 812-3456-7890" },
                { icon: Mail, text: "info@bimbelalruumi.com" },
                { icon: Clock, text: "Senin - Sabtu, 08:00 - 20:00 WIB" },
              ].map((contact, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <contact.icon
                    size={16}
                    style={{
                      color: "var(--color-primary-400)",
                      marginTop: "3px",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.6,
                    }}
                  >
                    {contact.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
                fontFamily: "var(--font-outfit), sans-serif",
                color: "var(--color-gold-400)",
              }}
            >
              Tautan Cepat
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              {[
                { label: "Beranda", href: "#beranda" },
                { label: "Visi & Misi", href: "#visi-misi" },
                { label: "Program Belajar", href: "#program" },
                { label: "Keunggulan", href: "#keunggulan" },
                { label: "Aturan & Ketentuan", href: "#aturan" },
                { label: "Portal Mentor", href: "/login" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.paddingLeft = "4px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "2rem",
            height: "200px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.29600791963!2d106.82497!3d-6.2297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sBekasi!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="200"
            style={{ border: 0, filter: "grayscale(0.3) brightness(0.8)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Bimbel Al Ruumi"
          />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            © {currentYear} Bimbel Al Ruumi. Hak cipta dilindungi.
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Dibuat dengan ❤️ untuk pendidikan Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
