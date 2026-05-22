# Data Fetching

## Règles

1. Fetcher dans les Server Components, passer les données en props
2. Paralléliser avec `Promise.all()` quand les requêtes sont indépendantes
3. Jamais de fetch dans un Client Component — utiliser Server Actions ou route handlers
4. Typer les retours Supabase explicitement

## ❌ Incorrect

```tsx
// Fetches en série — lent
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select();
  const { data: profile } = await supabase.from("profiles").select().single();
  // ...
}
```

```tsx
"use client";
// Fetch Supabase direct dans un Client Component
export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    supabase.from("projects").select().then(({ data }) => setProjects(data));
  }, []);
}
```

## ✅ Correct

```tsx
// Fetches parallèles
export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: profile }] = await Promise.all([
    supabase.from("projects").select("id, name, created_at"),
    supabase.from("profiles").select("full_name, avatar_url").single(),
  ]);

  return <Dashboard projects={projects ?? []} profile={profile} />;
}
```

```tsx
// Client Component reçoit les données en props
"use client";
type Project = { id: string; name: string; created_at: string };

export function ProjectList({ projects }: { projects: Project[] }) {
  return <ul>{projects.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

## Suspense pour les données lentes

```tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<SkeletonList />}>
        <SlowDataComponent />
      </Suspense>
    </div>
  );
}
```

## Sélectionner uniquement les colonnes nécessaires

```ts
// ❌ Sur-fetch
supabase.from("projects").select("*")

// ✅ Sélection explicite
supabase.from("projects").select("id, name, created_at")
```
