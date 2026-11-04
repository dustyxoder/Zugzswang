import { ImageResponse } from "next/og";

export const alt = "ZUGZWANG — Personal Chess Coaching & Free Introductory Call";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const squares = Array.from({ length: 8 * 4 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #101A24 0%, #17232D 100%)",
          color: "#F7F4EC",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", position: "absolute", right: 0, top: 0, width: 400, height: 630, opacity: 0.12 }}>
          {squares.map((i) => (
            <div key={i} style={{ width: 100, height: 100, background: (Math.floor(i / 4) + i) % 2 === 0 ? "#2F765A" : "transparent" }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="96" height="96" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="14" fill="#2F765A" />
            <path fill="#F7F4EC" d="M13 38v-3c0-6 4.5-9 8-13-3 0-5.5 1.5-8 4l-3-2c0-4 5-11 10-14l1-4 4 3c8 0 12 7 12 16 0 4-1.5 8-3 13z" />
            <circle cx="26" cy="16" r="1.8" fill="#2F765A" />
            <path d="M11 39.5h26" stroke="#D7F36B" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 10 }}>ZUGZWANG</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 48, lineHeight: 1.05, maxWidth: 900 }}>
          Think deeper. Play smarter. Enjoy every move.
        </div>
        <div style={{ marginTop: 40, fontSize: 32, color: "#D7F36B" }}>Personal chess coaching · Free introductory call</div>
      </div>
    ),
    size,
  );
}

