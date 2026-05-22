# Skill: new-page

Crée une nouvelle page dans le projet AlemAgency au bon endroit selon qu'elle est publique ou protégée.

## Ce que tu reçois

L'utilisateur précise le nom et le type de page (ex: `/new-page pricing publique` ou `/new-page team protégée`).

Si le type n'est pas précisé, demande : publique ou protégée ?

## Règle de placement

| Type | Route group | Exemple |
|---|---|---|
| Publique (pas d'auth requise) | `src/app/(auth)/` | `/login`, `/pricing`, `/about` |
| Protégée (auth requise) | `src/app/(dashboard)/` | `/dashboard`, `/settings`, `/team` |

## Page publique

`src/app/(auth)/<nom>/page.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "<Titre> | AlemAgency",
};

export default function <NomPascalCase>Page() {
  return (
    <main>
      {/* contenu */}
    </main>
  );
}
```

## Page protégée

`src/app/(dashboard)/<nom>/page.tsx`

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function <NomPascalCase>Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold"><Titre></h1>
    </div>
  );
}
```

## Conventions

- Toujours Server Component par défaut
- Exporter `metadata` uniquement pour les pages publiques (les pages protégées peuvent l'avoir aussi si utile pour le SEO)
- Ne pas ajouter de layout dans le route group sauf si l'utilisateur le demande explicitement
- Imports avec `@/`

Après création, lancer `npm run type-check`.
