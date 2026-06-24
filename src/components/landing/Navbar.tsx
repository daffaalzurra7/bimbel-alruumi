"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#visi-misi", label: "Visi & Misi" },
  { href: "#program", label: "Program" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#aturan", label: "Aturan" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="main-navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: isScrolled
          ? "rgba(5, 63, 36, 0.95)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(16px) saturate(180%)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid transparent",
        boxShadow: isScrolled
          ? "0 4px 30px rgba(0,0,0,0.15)"
          : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: isScrolled ? "64px" : "80px",
          transition: "height 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f9bc24, #d4930c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(212, 147, 12, 0.35)",
            }}
          >
            <BookOpen size={22} color="#3a1f06" strokeWidth={2.5} />
          </div>
          <div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "white",
                fontFamily: "var(--font-outfit), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Al Ruumi
            </span>
            <div
              style={{
                fontSize: "0.6875rem",
                color: "rgba(255,255,255,0.6)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginTop: "-2px",
              }}
            >
              Bimbingan Belajar
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="nav-desktop"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            style={{
              marginLeft: "1rem",
              padding: "0.5rem 1.25rem",
              background: "linear-gradient(135deg, #f9bc24, #d4930c)",
              color: "#3a1f06",
              fontSize: "0.875rem",
              fontWeight: 700,
              borderRadius: "10px",
              textDecoration: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px rgba(212, 147, 12, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(212, 147, 12, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(212, 147, 12, 0.3)";
            }}
          >
            <GraduationCap size={16} />
            Portal Mentor
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.1)",
            cursor: "pointer",
            color: "white",
          }}
          className="nav-mobile-btn"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{
            background: "rgba(5, 63, 36, 0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "1.5rem",
          }}
          className="nav-mobile-menu"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                fontWeight: 500,
                borderRadius: "10px",
                transition: "all 0.2s ease",
              }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "1rem",
              padding: "0.75rem",
              background: "linear-gradient(135deg, #f9bc24, #d4930c)",
              color: "#3a1f06",
              fontSize: "0.9375rem",
              fontWeight: 700,
              borderRadius: "12px",
              textDecoration: "none",
            }}
          >
            <GraduationCap size={18} />
            Portal Mentor
          </Link>
        </div>
      )}

      {/* Responsive CSS */}
      <style jsx global>{`
        .nav-desktop {
          display: flex !important;
        }
        .nav-mobile-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
