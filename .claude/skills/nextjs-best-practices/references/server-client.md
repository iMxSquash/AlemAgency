# Server vs Client Components

## Règle principale

**Server Component par défaut.** Ajouter `"use client"` seulement si l'un de ces cas s'applique :
- Hook React (`useState`, `useEffect`, `useRouter`, `useSearchParams`…)
- Event handler (`onClick`, `onChange`…)
- API navigateur (`window`, `localStorage`, `document`…)
- Bibliothèque tierce qui n'est pas compatible Server

## ❌ Incorrect

```tsx
"use client"; // inutile — pas d'interactivité

export default function UserCard({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

```tsx
// Client Component qui importe directement un Server Component
"use client";
import { ServerOnlyComponent } from "./ServerOnlyComponent"; // erreur à runtime
```

## ✅ Correct

```tsx
// Server Component — pas de directive nécessaire
export default function UserCard({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

```tsx
// Passer un Server Component comme children à un Client Component
"use client";
export default function Shell({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// Dans un Server Component parent :
// <Shell><ServerOnlyComponent /></Shell>
```

## Frontière Server/Client

La frontière s'applique au module, pas au fichier. Tout ce qu'un Client Component importe devient client-side. Garder les Client Components petits et les pousser aux feuilles de l'arbre.
