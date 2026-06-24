"use client";

import { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)" }}>
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid var(--color-neutral-200)", borderTopColor: "var(--color-primary-500)", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
          Memuat...
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const role = (session?.user as { role?: string })?.role || "MENTOR";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <Sidebar
        role={role}
        isCollapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="dashboard-main" style={{ flex: 1, marginLeft: "260px", transition: "margin-left 0.3s ease", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <DashboardHeader
          userName={session?.user?.name || "User"}
          userRole={role}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .dashboard-main {
            margin-left: 0 !important;
          }
          .dashboard-main main {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardContent>{children}</DashboardContent>
    </SessionProvider>
  );
}
