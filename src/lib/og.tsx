import { ImageResponse } from "next/og";

// Shared 1200×630 branded OpenGraph card used by the per-room and per-residence
// `opengraph-image` routes. A real photo (when available) sits behind a teal
// gradient with the LOFTZ wordmark + title + price/eyebrow. Inline styles only
// (satori); every multi-child element declares display:flex.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const TEAL = "#0e9cb8";
const CORAL = "#E96054"; // canonical logo coral (D-31)

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
          <svg
            width="40"
            height="55"
            viewBox="0 0 80.311 110.541"
            style={{ marginRight: 16 }}
          >
            <path
              fill="#ffffff"
              d="M 40.155 62.059 C 28.078 62.059, 18.252 52.233, 18.252 40.156 C 18.252 28.079, 28.078 18.253, 40.155 18.253 C 52.233 18.253, 62.058 28.079, 62.058 40.156 C 62.058 52.233, 52.233 62.059, 40.155 62.059 M 40.155 0.000 C 18.013 0.000, 0.000 18.014, 0.000 40.156 C 0.000 62.298, 18.013 80.311, 40.155 80.311 C 62.297 80.311, 80.311 62.298, 80.311 40.156 C 80.311 18.014, 62.297 0.000, 40.155 0.000"
            />
            <path
              fill={CORAL}
              d="M 40.155 92.403 C 30.496 92.403, 21.068 89.735, 12.890 84.687 L 3.362 100.120 C 14.405 106.937, 27.128 110.541, 40.155 110.541 C 53.182 110.541, 65.905 106.937, 76.948 100.120 L 67.421 84.687 C 59.243 89.735, 49.815 92.403, 40.155 92.403"
            />
          </svg>
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
