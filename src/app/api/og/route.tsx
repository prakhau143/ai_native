import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const savings = parseInt(searchParams.get("savings") ?? "0", 10);
  const annual = savings * 12;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050b1a 0%, #0d1a35 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background dots */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-100px", left: "200px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-50px", right: "150px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)", filter: "blur(60px)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #06b6d4, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "20px", fontWeight: "900" }}>⚡</span>
          </div>
          <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>SpendWiseAI</span>
        </div>

        {/* Main savings number */}
        <div style={{ fontSize: "96px", fontWeight: "900", background: "linear-gradient(135deg, #34d399, #06b6d4, #a855f7)", WebkitBackgroundClip: "text", color: "transparent", lineHeight: 1, marginBottom: "12px" }}>
          ${savings.toLocaleString()}
        </div>
        <div style={{ fontSize: "28px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
          saved per month · ${annual.toLocaleString()} per year
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: "20px", color: "rgba(148,163,184,0.9)", marginBottom: "40px" }}>
          Free AI spend audit by SpendWiseAI — run yours in 2 minutes
        </div>

        {/* CTA pill */}
        <div style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)", borderRadius: "50px", padding: "12px 32px", fontSize: "18px", fontWeight: "700", color: "white" }}>
          spendwiseai.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
