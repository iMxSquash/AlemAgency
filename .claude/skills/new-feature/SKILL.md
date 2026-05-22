# Skill: new-feature

Crée une feature complète dans le projet AlemAgency selon les conventions du projet.

## Ce que tu reçois

L'utilisateur passe un nom de feature en argument (ex: `/new-feature user-settings`).

## Ce que tu dois créer

Pour une feature `<nom>` :

### 1. Route protégée
`src/app/(dashboard)/<nom>/page.tsx`
- Server Component async
- Récupère l'user via `createClient()` de `@/lib/supabase/server`
- Redirige vers `/login` si non authentifié
- Importe et affiche le composant principal de la feature

### 2. Composant principal
`src/components/<nom>/<NomPascalCase>.tsx`
- `"use client"` uniquement si interactions nécessaires
- Props typées avec une interface locale ou depuis `@/types`
- Utilise `cn()` de `@/lib/utils` pour les classes conditionnelles

### 3. Server Action
`src/app/(dashboard)/<nom>/actions.ts`
- `"use server"` en haut du fichier
- Vérifie l'auth Supabase en début de chaque action
- Retourne `{ data, error }` — jamais de throw côté action
- Types de retour explicites

### 4. Types (si nouveaux types nécessaires)
Ajouter dans `src/types/index.ts`

## Conventions à respecter

- Imports toujours avec `@/`
- Pas de commentaires évidents
- Server Component par défaut, `"use client"` seulement si état/événements nécessaires
- Nommage : fichiers en kebab-case, composants en PascalCase

## Exemple de page protégée

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserSettings } from "@/components/user-settings/UserSettings";

export default async function UserSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <UserSettings userId={user.id} />;
}
```

## Exemple de Server Action

```ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateUserSettings(payload: { fullName: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: payload.fullName })
    .eq("id", user.id)
    .select()
    .single();

  return { data, error: error?.message ?? null };
}
```

Après création, lance `npm run type-check` pour valider.
