import { ArrowRight } from "lucide-react";

export function FeaturedBanner() {
  return (
    <div
      className="flex items-center w-full relative overflow-hidden"
      style={{
        height: 251,
        padding: 32,
        gap: 32,
        borderRadius: 24,
        background: "#2F9DD4",
      }}
    >
      {/* Left content */}
      <div className="flex flex-col flex-1" style={{ gap: 12 }}>
        {/* PARCOURS À LA UNE */}
        <span
          style={{
            color: "#FFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.88px",
            lineHeight: "normal",
            textTransform: "uppercase",
          }}
        >
          PARCOURS À LA UNE
        </span>

        {/* Main title — white, Inter 28px bold */}
        <h2
          style={{
            color: "#FFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.14px",
            lineHeight: "normal",
            alignSelf: "stretch",
            margin: 0,
          }}
        >
          Les enseignants en première ligne, avec les bons outils
        </h2>

        {/* Subtitle — white, opacity 0.9 */}
        <p
          style={{
            color: "#FFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "normal",
            opacity: 0.9,
            margin: 0,
          }}
        >
          Des fiches conçus par des professionnels de la santé (psychologue, pédiatre,
          orthophinsites...)
        </p>

        {/* CTA button — padding 12px 20px, radius 999, bg white */}
        <div style={{ marginTop: 4 }}>
          <button
            type="button"
            className="flex items-center hover:opacity-90 transition-opacity"
            style={{
              padding: "12px 20px",
              gap: 8,
              borderRadius: 999,
              background: "#FFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: "#2F9DD4",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              Commencer à parcourir les fiches
            </span>
            <ArrowRight style={{ width: 16, height: 16, color: "#2F9DD4" }} />
          </button>
        </div>
      </div>

      {/* Right frame — width 320, padding 24, gap 12, flex col */}
      <div
        className="hidden lg:flex flex-col items-start shrink-0"
        style={{
          width: 320,
          padding: 24,
          gap: 12,
          borderRadius: 16,
          background: "rgba(255,255,255,0.15)",
        }}
      >
        {[
          "Consultez les fiches sans limites",
          "Recherchez des thèmes",
          "Enregistrez les fiches pertinentes selon vous",
        ].map((item) => (
          <div key={item} className="flex items-start" style={{ gap: 10 }}>
            <span
              className="shrink-0 rounded-full"
              style={{
                width: 6,
                height: 6,
                marginTop: 7,
                background: "rgba(255,255,255,0.6)",
              }}
            />
            <span
              style={{
                color: "#FFF",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                opacity: 0.9,
                lineHeight: "normal",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
