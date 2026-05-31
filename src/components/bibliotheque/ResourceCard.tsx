import type { Resource } from "@/types/index";
import Link from "next/link";

const CATEGORY_BG: Record<string, string> = {
  TSA: "#DBEAFE",
  TDAH: "#FFEDD5",
  DYS: "#D1FAE5",
  TDI: "#EDE9FE",
};

const CATEGORY_LABEL: Record<string, string> = {
  TSA: "TSA",
  TDAH: "TDAH",
  DYS: "DYS",
  TDI: "TDI",
};

const BADGE_COLOR: Record<string, string> = {
  TSA: "#1D4ED8",
  TDAH: "#C2410C",
  DYS: "#047857",
  TDI: "#6D28D9",
};

const DOT_COLOR: Record<string, string> = {
  TSA: "#60A5FA",
  TDAH: "#FB923C",
  DYS: "#34D399",
  TDI: "#A78BFA",
};

interface Props {
  resource: Resource;
  href?: string;
  isSaved?: boolean;
  isInProgress?: boolean;
  isRead?: boolean;
}

export function ResourceCard({ resource, href, isSaved, isInProgress, isRead }: Props) {
  const bg = CATEGORY_BG[resource.category] ?? "#E5E7EB";
  const label = CATEGORY_LABEL[resource.category] ?? resource.category;
  const badgeColor = BADGE_COLOR[resource.category] ?? "#374151";
  const dotColor = DOT_COLOR[resource.category] ?? "#9CA3AF";

  return (
    <Link
      href={href ?? "#"}
      className="flex flex-col items-start bg-white cursor-pointer group hover:shadow-lg transition-shadow duration-200"
      style={{
        width: "calc((100% - 108px) / 3)",
        minWidth: 280,
        borderRadius: 20,
        border: "1px solid #E8E7E3",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      {/* Colored thumbnail */}
      <div className="w-full relative" style={{ background: bg, height: 160 }}>
        {isRead && (
          <span
            className="absolute font-medium text-white"
            style={{
              bottom: 10,
              left: 12,
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
              bottom: 10,
              left: 12,
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
      <div className="flex flex-col w-full" style={{ padding: "16px 20px 20px", gap: 8 }}>
        {/* Category badge */}
        <div className="flex items-center justify-between">
          <span
            className="font-semibold"
            style={{
              fontSize: 11,
              color: badgeColor,
              background: `${bg}`,
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

        {/* Footer row */}
        <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
          <div className="flex items-center" style={{ gap: 6 }}>
            <span
              className="rounded-full shrink-0"
              style={{ width: 8, height: 8, background: dotColor }}
            />
            <span className="text-gray-500" style={{ fontFamily: "Inter", fontSize: 12 }}>
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </span>
          </div>
          <span className="text-gray-400" style={{ fontFamily: "Inter", fontSize: 12 }}>
            {resource.estimatedReadTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
