# Auth & Middleware

## Clients Supabase — lequel utiliser

| Contexte | Import |
|---|---|
| Server Component, layout, page | `@/lib/supabase/server` |
| Server Action, route handler | `@/lib/supabase/server` |
| Client Component | `@/lib/supabase/client` |
| Middleware | `@/lib/supabase/middleware` |

**Jamais** utiliser `SUPABASE_SERVICE_ROLE_KEY` côté client ou dans du code accessible depuis le navigateur.

## Vérification d'auth

Toujours utiliser `getUser()` — jamais `getSession()` pour vérifier l'identité.
`getSession()` ne valide pas le JWT côté serveur.

```ts
// ❌ Incorrect — session non validée côté serveur
const { data: { session } } = await supabase.auth.getSession();
if (!session) redirect("/login");

// ✅ Correct
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

## Pattern page protégée

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // suite...
}
```

## Middleware

Le middleware (`src/middleware.ts`) rafraîchit la session Supabase sur chaque requête.
Ne pas dupliquer la logique d'auth dans le middleware ET dans les pages — le middleware gère le refresh, les pages gèrent la redirection.

Le matcher exclut les assets statiques pour ne pas ralentir les requêtes de fichiers.
