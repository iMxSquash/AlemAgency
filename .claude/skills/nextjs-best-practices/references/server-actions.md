# Server Actions

## Règles

1. `"use server"` en haut du fichier (fichier dédié) ou en haut de la fonction inline
2. Vérifier l'auth **en premier** — avant toute logique
3. Retourner `{ data, error }` — jamais de `throw`
4. Types de retour explicites

## ❌ Incorrect

```ts
"use server";

export async function deleteProject(id: string) {
  // Pas de vérification d'auth — n'importe qui peut appeler cette action
  await supabase.from("projects").delete().eq("id", id);
}
```

```ts
"use server";

export async function createProject(name: string) {
  const { data, error } = await supabase.from("projects").insert({ name });
  if (error) throw new Error(error.message); // ne pas throw depuis une action
}
```

## ✅ Correct

```ts
"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult<T> = { data: T; error: null } | { data: null; error: string };

export async function createProject(name: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, user_id: user.id })
    .select("id")
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
```

## Validation des inputs

Pour les actions exposées via formulaire, valider avec zod :

```ts
import { z } from "zod";

const schema = z.object({ name: z.string().min(1).max(100) });

export async function createProject(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };
  // ...
}
```
