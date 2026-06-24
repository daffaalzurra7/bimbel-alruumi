"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardCheck,
  Users,
  FileText,
  BookMarked,
  UserCog,
  GraduationCap,
  Calendar,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
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
];

export default function Sidebar({ role, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const menu = role === "ADMIN" ? adminMenu : mentorMenu;

  return (
    <>
      <aside
        style={{
          width: isCollapsed ? "72px" : "260px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, var(--color-primary-950) 0%, var(--color-primary-900) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: isCollapsed ? "1.25rem 0.75rem" : "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <div style={{ position: "relative", width: "36px", height: "36px", flexShrink: 0 }}>
            <Image src="/Logo.png" alt="Logo" fill style={{ objectFit: "contain" }} />
          </div>
          {!isCollapsed && (
            <div>
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  color: "white",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Al Ruumi
              </span>
              <div
                style={{
                  fontSize: "0.625rem",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: "-2px",
                }}
              >
                Dashboard
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "4px" }}>
          {menu.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: isCollapsed ? "0.75rem" : "0.75rem 1rem",
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
                  justifyContent: isCollapsed ? "center" : "flex-start",
                }}
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                {!isCollapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
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
            transition: "color 0.2s",
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Tutup Sidebar</>}
        </button>
      </aside>

      {/* Mobile Overlay - for responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          aside {
            transform: ${isCollapsed ? "translateX(-100%)" : "translateX(0)"};
            width: 260px !important;
          }
        }
      `}</style>
    </>
  );
}
