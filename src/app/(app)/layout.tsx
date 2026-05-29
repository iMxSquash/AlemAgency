import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#FAFAF9",
        position: "relative",
      }}
    >
      {/* Sidebar fixed 248px */}
      <Sidebar />

      {/* Content starts at exactly 248px — no extra padding/margin */}
      <main
        style={{
          position: "absolute",
          left: 248,
          right: 0,
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}