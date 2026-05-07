// Open Graph image dinamica para previews en WhatsApp, Twitter, LinkedIn.
// Next 16 la genera automaticamente desde este archivo.

import { ImageResponse } from "next/og";

export const alt = "Clariza — Tu reclamo financiero, sin abogados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF7F2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
        }}
      >
        {/* Top — eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#6B7280",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#CC785C",
            }}
          />
          Reclamos financieros · Chile
        </div>

        {/* Center — titular */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              color: "#1A1F2E",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Reclama tu plata.
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              color: "#CC785C",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            En 5 minutos.
          </div>
        </div>

        {/* Bottom — bar with brand + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#475569",
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#CC785C",
              }}
            />
            <span style={{ color: "#1A1F2E", fontWeight: 600 }}>Clariza</span>
          </div>
          <span>clariza-app.netlify.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
