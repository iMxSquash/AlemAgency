"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase renvoie "Invalid login credentials" pour email inconnu ET mauvais mot de passe
    // On affiche volontairement un message générique pour ne pas divulguer si l'email existe
    const message =
      error.message === "Email not confirmed"
        ? "Confirmez+votre+email+avant+de+vous+connecter"
        : "Email+ou+mot+de+passe+incorrect";
    redirect(`/login?error=${message}`);
  }

  redirect("/bibliotheque");
}
