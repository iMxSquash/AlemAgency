"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveResource(slug: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("saved_resources")
    .insert({ user_id: user.id, resource_slug: slug });

  // 23505 = unique_violation : fiche déjà sauvegardée, on ignore
  if (error && error.code !== "23505") {
    console.error("saveResource:", error.message);
  }

  revalidatePath(`/bibliotheque/${slug}`);
}

export async function markAsCompleted(slug: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("reading_progress").upsert(
    {
      user_id: user.id,
      resource_slug: slug,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,resource_slug" },
  );

  if (error) console.error("markAsCompleted:", error.message);

  revalidatePath(`/bibliotheque/${slug}`);
}
