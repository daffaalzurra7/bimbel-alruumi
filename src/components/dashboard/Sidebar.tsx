"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home, ClipboardCheck, Users, FileText, BookMarked,
  UserCog, GraduationCap, Calendar, CreditCard, BarChart3,
  ChevronLeft, X, PenLine,
} from "lucide-react";

interface SidebarProps {
  role: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const mentorMenu = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/dashboard/presensi", label: "Presensi", icon: ClipboardCheck },
  { href: "/dashboard/siswa", label: "Siswa Saya", icon: Users },
  { href: "/dashboard/laporan", label: "Laporan Harian", icon: FileText },
  { href: "/dashboard/catatan-bulanan", label: "Catatan Bulanan", icon: BookMarked },
];

const adminMenu = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/dashboard/admin/mentor", label: "Kelola Mentor", icon: UserCog },
  { href: "/dashboard/admin/siswa", label: "Kelola Siswa", icon: GraduationCap },
  { href: "/dashboard/admin/jadwal", label: "Kelola Jadwal", icon: Calendar },
  { href: "/dashboard/admin/pembayaran", label: "Pembayaran", icon: CreditCard },
  { href: "/dashboard/admin/laporan", label: "Laporan & Presensi", icon: BarChart3 },
  { href: "/dashboard/admin/cms", label: "Kelola Konten", icon: PenLine },
];

export default function Sidebar({ role, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const menu = role === "ADMIN" ? adminMenu : mentorMenu;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {!isCollapsed && (
        <div
          className="sidebar-backdrop"
          onClick={onToggle}
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 39,
          }}
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, var(--color-primary-950) 0%, var(--color-primary-900) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        {/* Logo + Close button */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative", width: "36px", height: "36px", flexShrink: 0 }}>
              <Image src="/Logo.png" alt="Logo" fill style={{ objectFit: "contain" }} />
            </div>
            <div>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "white", fontFamily: "var(--font-outfit), sans-serif" }}>
                Al Ruumi
              </span>
              <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "-2px" }}>
                Dashboard
              </div>
            </div>
          </div>
          {/* Close button visible on mobile */}
          <button
            className="sidebar-close-btn"
            onClick={onToggle}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
          {menu.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth <= 768) onToggle();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                  background: isActive
                    ? "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))"
                    : "transparent",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          onClick={onToggle}
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
          }}
        >
          <ChevronLeft size={18} /> Tutup Sidebar
        </button>
      </aside>

      <style jsx global>{`
        /* Mobile: sidebar as overlay */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar-open {
            transform: translateX(0) !important;
          }
          .sidebar-backdrop {
            display: block !important;
          }
          .sidebar-close-btn {
            display: flex !important;
          }
          .sidebar-collapse-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
