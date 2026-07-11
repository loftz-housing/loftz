import { ImageResponse } from "next/og";

// Shared 1200×630 branded OpenGraph card used by the per-room and per-residence
// `opengraph-image` routes. A real photo (when available) sits behind a teal
// gradient with the LOFTZ wordmark + title + price/eyebrow. Inline styles only
// (satori); every multi-child element declares display:flex.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const TEAL = "#0e9cb8";
const CORAL = "#f26a45";

export function loftzOgResponse({
  photoUrl,
  eyebrow,
  title,
  price,
}: {
  photoUrl?: string | null;
  eyebrow?: string | null;
  title: string;
  price?: string | null;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: TEAL,
          fontFamily: "sans-serif",
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- satori (ImageResponse) renders a real raster, not a DOM <img>; next/image is not usable here
          <img
            src={photoUrl}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* Legibility gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background:
              "linear-gradient(160deg, rgba(14,156,184,0.55) 0%, rgba(11,45,55,0.35) 45%, rgba(11,35,42,0.9) 100%)",
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 60,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "3px solid #ffffff",
              marginRight: 16,
            }}
          />
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            LOFTZ
          </div>
        </div>

        {/* Bottom content */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                color: "#ffffff",
                opacity: 0.85,
                fontSize: 28,
                marginBottom: 14,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {price ? (
            <div style={{ display: "flex", marginTop: 26 }}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: CORAL,
                  color: "#ffffff",
                  fontSize: 32,
                  fontWeight: 600,
                  padding: "12px 28px",
                  borderRadius: 999,
                }}
              >
                {price}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    ogSize
  );
}
