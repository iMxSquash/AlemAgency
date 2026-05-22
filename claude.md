# AlemAgency

SaaS en Next.js 15. Ce fichier documente les conventions du projet pour Claude Code.

## Stack

- **Framework** : Next.js 15 (App Router, Turbopack)
- **Language** : TypeScript strict
- **Styles** : Tailwind CSS v4
- **Auth + DB** : Supabase (PostgreSQL, RLS, SSR)
- **Linting** : Biome (remplace ESLint + Prettier)
- **Tests unitaires** : Vitest + Testing Library
- **Tests e2e** : Playwright

## Structure

```
src/
  app/
    (public)/       # Routes publiques (login, signup, pages marketing)
    (app)/          # Routes protégées
  lib/
    supabase/       # client.ts (browser), server.ts (RSC), middleware.ts
    utils.ts        # cn()
  types/            # Types partagés
  middleware.ts     # Auth guard Supabase
  tests/
    setup.ts
    e2e/
supabase/
  migrations/       # SQL versionnés
```

## Conventions

- Imports : toujours avec `@/` (alias src/)
- Composants : PascalCase, un fichier = un composant
- Server Components par défaut, `"use client"` seulement si nécessaire
- Pas de commentaires évidents ; un commentaire = une contrainte non-obvie
- `cn()` de `@/lib/utils` pour les classes conditionnelles

## Commandes

```bash
npm run dev          # Dev avec Turbopack
npm run build        # Build production
npm run lint         # Biome check
npm run lint:fix     # Biome check + autofix
npm run type-check   # tsc --noEmit
npm run test         # Vitest (run once)
npm run test:watch   # Vitest (watch)
npm run test:e2e     # Playwright
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Ne jamais committer `.env`.
