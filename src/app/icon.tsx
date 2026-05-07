// Favicon dinamico generado por Next 16. Aparece en pestanas y bookmarks.
// Reemplaza el favicon.ico default de create-next-app.

import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF7F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "#CC785C",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
