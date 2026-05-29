"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmation = formData.get("confirmation") as string;

  if (password !== confirmation) {
    redirect("/signup?error=Les+mots+de+passe+ne+correspondent+pas");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const message =
      error.message === "User already registered"
        ? "Un+compte+existe+déjà+avec+cet+email"
        : error.message.startsWith("Password should be at least")
          ? "Le+mot+de+passe+doit+contenir+au+moins+6+caractères"
          : "Impossible+de+créer+le+compte,+réessayez";
    redirect(`/signup?error=${message}`);
  }

  redirect("/signup?success=1");
}
