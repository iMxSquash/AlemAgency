import type { Resource } from "@/types/bibliotheque";

/* Exact colors from Figma screenshot */
const CATEGORY_BG: Record<string, string> = {
  Autisme:      "#4ADE80", // green
  TDAH:         "#FB923C", // orange
  Dyslexie:     "#FACC15", // yellow
  Comportement: "#60A5FA", // blue
  Motricité:    "#C084FC", // purple
};

const CATEGORY_LABEL: Record<string, string> = {
  Autisme:      "TSA",
  TDAH:         "TDAH",
  Dyslexie:     "DYS",
  Comportement: "TDI",
  Motricité:    "Motricité",
};

/* Badge text color per category */
const BADGE_COLOR: Record<string, string> = {
  Autisme:      "#166534",
  TDAH:         "#7C2D12",
  Dyslexie:     "#713F12",
  Comportement: "#1E3A5F",
  Motricité:    "#581C87",
};

/* Author dot color per category */
const DOT_COLOR: Record<string, string> = {
  Autisme:      "#4ADE80",
  TDAH:         "#FB923C",
  Dyslexie:     "#FACC15",
  Comportement: "#60A5FA",
  Motricité:    "#C084FC",
};

interface Props {
  resource: Resource;
  isSaved?: boolean;
  isInProgress?: boolean;
  isRead?: boolean;
}

export function ResourceCard({ resource, isSaved, isInProgress, isRead }: Props) {
  const bg        = CATEGORY_BG[resource.category]    ?? "#E5E7EB";
  const label     = CATEGORY_LABEL[resource.category] ?? resource.category;
  const badgeColor = BADGE_COLOR[resource.category]   ?? "#374151";
  const dotColor  = DOT_COLOR[resource.category]      ?? "#9CA3AF";

  return (
    /*
      Figma:
      display: flex; flex-direction: column; align-items: flex-start;
      flex: 1 0 0; align-self: stretch;
      border-radius: 20px; border: 1px solid #E8E7E3; background: #FFF;
    */
    <div
      className="flex flex-col items-start bg-white cursor-pointer group hover:shadow-lg transition-shadow duration-200"
      style={{
        width: "calc((100% - 108px) / 3)",
        minWidth: 280,
        borderRadius: 20,
        border: "1px solid #E8E7E3",
        overflow: "hidden",
      }}
    >
      {/* Colored thumbnail — clean, no pills on top */}
      <div
        className="w-full relative"
        style={{ background: bg, height: 160 }}
      >
        {/* Status badges only */}
        {isRead && (
          <span
            className="absolute font-medium text-white"
            style={{
              bottom: 10, left: 12,
              background: "#22C55E",
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            Lu ✓
          </span>
        )}
        {isInProgress && !isRead && (
          <span
            className="absolute font-medium text-white"
            style={{
              bottom: 10, left: 12,
              background: "#F59E0B",
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            En cours
          </span>
        )}
      </div>

      {/* Card body */}
      <div
        className="flex flex-col w-full"
        style={{ padding: "16px 20px 20px", gap: 8 }}
      >
        {/* Category badge */}
        <div className="flex items-center justify-between">
          <span
            className="font-semibold"
            style={{
              fontSize: 11,
              color: badgeColor,
              background: bg + "55",
              padding: "2px 10px",
              borderRadius: 999,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </span>
          {isSaved && <span style={{ fontSize: 12 }}>🔖</span>}
        </div>

        {/* Title */}
        <p
          className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2F9DD4] transition-colors"
          style={{
            fontFamily: "Inter",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {resource.title}
        </p>

        {/* Description */}
        <p
          className="text-gray-500 line-clamp-2 leading-relaxed"
          style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 400 }}
        >
          {resource.description}
        </p>

        {/* Author row — colored dot + name (matches Figma) */}
        <div className="flex items-center" style={{ gap: 6, marginTop: 4 }}>
          <span
            className="rounded-full shrink-0"
            style={{ width: 8, height: 8, background: dotColor }}
          />
          <span
            className="text-gray-500"
            style={{ fontFamily: "Inter", fontSize: 12 }}
          >
            {resource.author}
          </span>
        </div>
      </div>
    </div>
  );
}