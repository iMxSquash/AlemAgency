# Performance

## loading.tsx

Ajouter un `loading.tsx` à côté de chaque page avec du data fetching lent. Next.js l'affiche automatiquement via Suspense.

```tsx
// src/app/(dashboard)/projects/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Chargement...</div>;
}
```

## Metadata dynamique

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await fetchProject(params.id);
  return { title: `${project.name} | AlemAgency` };
}
```

## Images

Toujours utiliser `<Image>` de `next/image` — jamais `<img>` en production.

```tsx
import Image from "next/image";

<Image src={avatarUrl} alt="Avatar" width={40} height={40} className="rounded-full" />
```

## Éviter les re-renders inutiles

- Passer les données scalaires en props plutôt que des objets entiers quand possible
- Utiliser `useCallback` et `useMemo` uniquement si le profiling montre un problème — pas par défaut

## Route handlers vs Server Actions

| Cas | Utiliser |
|---|---|
| Mutation depuis un formulaire | Server Action |
| API appelée par un client externe ou webhook | Route handler |
| Téléchargement de fichier | Route handler |
| Mutation depuis un Client Component | Server Action |
