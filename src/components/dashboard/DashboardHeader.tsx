"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu, Shield, GraduationCap } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  onMenuToggle: () => void;
}

export default function DashboardHeader({ userName, userRole, onMenuToggle }: DashboardHeaderProps) {
  return (
    <header
      style={{
        height: "64px",
        background: "white",
        borderBottom: "1px solid var(--color-neutral-200)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 30,
        gap: "0.75rem",
      }}
    >
      {/* Left: Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="mobile-menu-btn"
        style={{
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          border: "1px solid var(--color-neutral-200)",
          background: "white",
          cursor: "pointer",
          color: "var(--text-secondary)",
          flexShrink: 0,
        }}
      >
        <Menu size={20} />
      </button>

      <div style={{ flex: 1 }} />

      {/* Right: User info + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        {/* Role Badge */}
        <div
          className="role-badge"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: userRole === "ADMIN" ? "var(--color-gold-50)" : "var(--color-primary-50)",
            color: userRole === "ADMIN" ? "var(--color-gold-700)" : "var(--color-primary-700)",
            border: `1px solid ${userRole === "ADMIN" ? "var(--color-gold-200)" : "var(--color-primary-200)"}`,
            whiteSpace: "nowrap",
          }}
        >
          {userRole === "ADMIN" ? <Shield size={12} /> : <GraduationCap size={12} />}
          {userRole}
        </div>

        {/* User Name - hide on very small screens */}
        <span className="user-name" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
          {userName}
        </span>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.875rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#dc2626",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <LogOut size={14} />
          <span className="logout-text">Keluar</span>
        </button>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .user-name { display: none !important; }
          header { padding: 0 1rem !important; }
        }
        @media (max-width: 400px) {
          .role-badge { display: none !important; }
          .logout-text { display: none !important; }
        }
      `}</style>
    </header>
  );
}
