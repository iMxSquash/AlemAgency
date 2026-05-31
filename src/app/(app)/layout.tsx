import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let savedCount = 0;
  let inProgressCount = 0;

  if (user) {
    const [{ count: sc }, { count: ic }] = await Promise.all([
      supabase
        .from("saved_resources")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("reading_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("completed_at", null),
    ]);
    savedCount = sc ?? 0;
    inProgressCount = ic ?? 0;
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Utilisateur";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join("");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#FAFAF9",
        position: "relative",
      }}
    >
      <Sidebar
        user={{ displayName, email: user?.email ?? "", initials }}
        savedCount={savedCount}
        inProgressCount={inProgressCount}
      />

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
