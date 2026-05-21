import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #14213d 45%, #c79a2b 100%)",
          color: "white",
          padding: "72px",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.78 }}>BerberGo</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, maxWidth: 880, lineHeight: 1.1 }}>
            Book premium barbershops with a marketplace experience.
          </div>
          <div style={{ fontSize: 30, opacity: 0.82 }}>
            Appointments, reviews, live chat, and operations dashboards.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
