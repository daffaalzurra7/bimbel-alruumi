"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { SessionProvider } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-900) 40%, var(--color-primary-800) 100%)" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "white", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
          Memuat...
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-900) 40%, var(--color-primary-800) 100%)",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="islamic-pattern" style={{ opacity: 0.03 }} />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ position: "relative", width: "64px", height: "64px", marginBottom: "1rem" }}>
            <Image src="/Logo.png" alt="Logo Al Ruumi" fill style={{ objectFit: "contain" }} priority />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary-900)", fontFamily: "var(--font-outfit), sans-serif", marginBottom: "0.25rem" }}>
            Portal Mentor
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Masuk ke dashboard Bimbel Al Ruumi
          </p>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.875rem", color: "#dc2626" }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="email" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mentor@bimbelalruumi.com"
              required
              style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "0.9375rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", outline: "none", transition: "border-color 0.2s ease", background: "white" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-500)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-neutral-200)")}
            />
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label htmlFor="password" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                style={{ width: "100%", padding: "0.75rem 3rem 0.75rem 1rem", fontSize: "0.9375rem", border: "2px solid var(--color-neutral-200)", borderRadius: "12px", outline: "none", transition: "border-color 0.2s ease", background: "white" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary-500)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-neutral-200)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "1rem",
              fontWeight: 700,
              color: "white",
              background: loading ? "var(--color-neutral-400)" : "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: loading ? "none" : "0 4px 14px rgba(13, 146, 85, 0.35)",
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
          © {new Date().getFullYear()} Bimbel Al Ruumi
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
