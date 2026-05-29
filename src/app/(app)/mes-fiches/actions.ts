"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function unsaveResource(slug: string, _formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("saved_resources")
    .delete()
    .eq("user_id", user.id)
    .eq("resource_slug", slug);

  if (error) console.error("unsaveResource:", error.message);

  revalidatePath("/mes-fiches");
}
