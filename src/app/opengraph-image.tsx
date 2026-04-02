import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ENSO TASK — 目標を、行動に変える";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ background: "#0a0a0a", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
        <svg width={160} height={160} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="32" stroke="#ededed" strokeWidth="5" fill="none" opacity="0.9" />
          <polyline points="38,50 46,58 62,40" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: 56, fontWeight: "bold", color: "#ededed", letterSpacing: "0.05em" }}>ENSO TASK</div>
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.4)" }}>目標を、行動に変える</div>
      </div>
    ),
    { ...size }
  );
}
