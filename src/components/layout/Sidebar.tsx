"use client";

import { Bookmark, LayoutDashboard, LogOut, PlayCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard, badge: null },
  { href: "/en-cours", label: "En cours...", icon: PlayCircle, badge: 0 },
  { href: "/bibliotheque", label: "Fiches enregistrées", icon: Bookmark, badge: 8 },
];

const FORUM_ITEMS = [
  { href: "/populaires", label: "Populaires" },
  { href: "/explorer", label: "Explorer" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 flex flex-col bg-white"
      style={{
        width: 248,
        height: "100vh", // fills full screen height always
        padding: "0",
        borderRight: "1px solid #E8E7E3",
        zIndex: 30,
        overflowY: "auto",
      }}
    >
      {/* Logo — padding: 4px 8px 24px 8px */}
      <div style={{ padding: "24px 16px 0 16px" }}>
        <div style={{ padding: "4px 8px 24px 8px" }}>
          <ZenkoLogo />
        </div>

        {/* Fiches section */}
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            padding: "0 8px 4px",
            margin: 0,
          }}
        >
          Fiches
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  background: isActive ? "#E8F5E9" : "transparent",
                  color: isActive ? "#2E7D32" : "#4B5563",
                  transition: "background 0.15s",
                }}
              >
                <Icon
                  style={{
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    color: isActive ? "#2E7D32" : "#9CA3AF",
                  }}
                />
                <span style={{ flex: 1 }}>{label}</span>
                {badge !== null && badge !== undefined && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "1px 7px",
                      borderRadius: 999,
                      background: isActive ? "#C8E6C9" : "#F3F4F6",
                      color: isActive ? "#2E7D32" : "#6B7280",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Forum section */}
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            padding: "8px 8px 4px",
            margin: 0,
          }}
        >
          Forum
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {FORUM_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  background: isActive ? "#E8F5E9" : "transparent",
                  color: isActive ? "#2E7D32" : "#4B5563",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Spacer pushes footer to bottom */}
      <div style={{ flex: 1 }} />

      {/* User footer — always visible at bottom */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #E8E7E3",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#4B5563",
              flexShrink: 0,
            }}
          >
            MD
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              Marie Dupont
            </p>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Enseignante CM1</p>
          </div>
        </div>

        {/* Se déconnecter — red button */}
        <button
          type="button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px",
            // gap: "10px",
            alignSelf: "stretch",
            borderRadius: "12px",
            border: "none",
            background: "#E04E4E",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            // justifyContent: "flex-start",
          }}
        >
          <LogOut style={{ width: 14, height: 14 }} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}

function ZenkoLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144 42"
      fill="none"
      style={{ width: 96, height: "auto" }}
      role="img"
      aria-label="ZENKO"
    >
      <g clipPath="url(#clip0_88_62)">
        <path
          d="M24.438 37.5679H0V32.847L11.3244 9.89221H1.63536V0.938843H24.438V5.92918L13.6524 27.8144H24.438V37.5718V37.5679Z"
          fill="#419FD7"
        />
        <path
          d="M50.3265 37.5679H28.1934V0.938843H50.3265V10.9618H39.183V15.325H48.2909V23.178H39.183V27.0717H50.3265V37.5679Z"
          fill="#F7A4C0"
        />
        <path
          d="M85.9085 37.5679H74.0492L65.4799 21.5004V37.5679H54.4941V0.938843H66.3534L74.9227 17.0064V0.938843H85.9085V37.5679Z"
          fill="#20CA73"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M131.267 24.7477C127.165 24.7477 123.979 23.5396 121.713 21.1233C119.608 18.8994 118.542 16.006 118.511 12.4431C118.511 8.98413 119.554 6.09459 121.644 3.78218C123.925 1.26201 127.134 0 131.267 0C135.4 0 138.586 1.26201 140.868 3.78218C142.957 6.09459 144 8.98029 144 12.4431C144 15.906 142.942 18.857 140.821 21.1233C138.567 23.5396 135.384 24.7477 131.267 24.7477ZM134.445 15.8405C133.714 16.7986 132.656 17.2949 131.267 17.3411C129.878 17.2949 128.816 16.7948 128.077 15.8405C127.338 14.8825 126.969 13.6744 126.969 12.2584C126.969 10.8425 127.346 9.6844 128.1 8.79177C128.855 7.89911 129.909 7.4297 131.267 7.38354C132.625 7.42586 133.676 7.89527 134.422 8.79177C135.169 9.6844 135.542 10.8233 135.542 12.2584C135.542 13.6936 135.177 14.8864 134.445 15.8405Z"
          fill="#EF6A22"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M127.508 41.9542C124.853 41.9542 122.579 41.5849 120.682 40.8462C118.789 40.1073 117.153 39.1301 115.779 37.9142C114.406 36.6984 113.198 35.3478 112.155 33.8627C111.112 32.3775 110.142 30.8693 109.246 29.3302C108.515 28.1376 107.78 26.987 107.041 25.8828C106.302 24.7785 105.502 23.7782 104.636 22.8856L102.062 26.2637V37.5641H91.0952V0.938843H102.062V10.4039L108.753 0.938843H121.286L110.185 15.5712C111.885 16.9141 113.351 18.4339 114.583 20.123C115.814 21.8158 116.93 23.5127 117.927 25.2134C118.823 26.7062 119.716 28.0722 120.612 29.3071C121.509 30.5462 122.486 31.5465 123.544 32.3044C124.603 33.0663 125.842 33.4472 127.258 33.4472C128.408 33.4472 129.459 33.1818 130.413 32.6545C131.367 32.1236 132.133 31.3426 132.706 30.3038C133.28 29.2687 133.568 27.9952 133.568 26.4869H143.123C143.123 29.5765 142.484 32.2775 141.21 34.5976C139.933 36.9177 138.128 38.7223 135.796 40.0111C133.461 41.3002 130.698 41.9465 127.504 41.9465L127.508 41.9542Z"
          fill="#FCD808"
        />
      </g>
      <defs>
        <clipPath id="clip0_88_62">
          <rect width="144" height="41.9542" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
