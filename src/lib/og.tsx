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

        {/* Wordmark — full traced LOFTZ lockup (white + coral smile) */}
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 60,
            display: "flex",
          }}
        >
          <svg width="200" height="62" viewBox="0 0 354.089 110.541">
            <path
              fill="#ffffff"
              d="M 93.106 62.059 C 81.029 62.059, 71.203 52.233, 71.203 40.156 C 71.203 28.079, 81.029 18.253, 93.106 18.253 C 105.184 18.253, 115.009 28.079, 115.009 40.156 C 115.009 52.233, 105.184 62.059, 93.106 62.059 M 93.106 0.000 C 70.964 0.000, 52.951 18.014, 52.951 40.156 C 52.951 62.298, 70.964 80.311, 93.106 80.311 C 115.248 80.311, 133.262 62.298, 133.262 40.156 C 133.262 18.014, 115.248 0.000, 93.106 0.000 M 354.089 0.112 L 279.048 0.107 L 279.048 18.240 L 320.657 18.250 C 320.657 18.250, 279.470 79.482, 279.133 80.293 L 279.125 80.305 L 279.128 80.305 C 279.128 80.307, 279.126 80.310, 279.125 80.312 L 353.922 80.312 L 353.922 62.174 L 312.557 62.174 C 313.992 60.059, 354.081 0.131, 354.081 0.131 L 354.089 0.119 L 354.086 0.119 Z M 206.445 0.102 L 206.445 18.235 L 228.393 18.235 L 228.393 18.319 L 228.393 80.365 L 246.530 80.365 L 246.530 18.319 L 246.530 18.235 L 269.388 18.240 L 269.388 0.106 Z M 45.904 62.174 L 18.138 62.174 L 18.138 0.098 L 0.000 0.098 L 0.000 80.312 L 59.817 80.312 C 53.935 75.397, 49.160 69.207, 45.904 62.174 M 139.658 0.098 L 139.658 80.366 L 157.795 80.366 L 157.795 53.301 L 172.043 53.301 L 172.043 35.163 L 157.795 35.163 L 157.795 18.235 L 196.785 18.235 L 196.785 0.102 Z"
            />
            <path
              fill={CORAL}
              d="M 93.106 92.403 C 83.447 92.403, 74.019 89.735, 65.841 84.687 L 56.313 100.120 C 67.356 106.937, 80.079 110.541, 93.106 110.541 C 106.133 110.541, 118.856 106.937, 129.899 100.120 L 120.372 84.687 C 112.194 89.735, 102.766 92.403, 93.106 92.403"
            />
          </svg>
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
