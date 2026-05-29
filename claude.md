# AlemAgency

SaaS en Next.js 15 — **MVP en cours**. Ce fichier documente les conventions du projet pour Claude Code.

## Règles MVP

Ce projet est un MVP. L'objectif est de livrer vite des fonctionnalités qui valident l'hypothèse produit, pas de construire une architecture parfaite. Ces règles ont priorité sur les préférences générales de style ou d'ingénierie.

### Ce qu'on fait

- **Livrer le chemin heureux** : implémenter le cas d'usage principal en entier avant de gérer les edge cases.
- **Utiliser des librairies existantes** : ne pas réimplémenter ce qu'un package fiable fait déjà (dates, validation, emails, etc.).
- **Hardcoder les valeurs non-critiques** : plans, limites, textes — extraire en constante seulement si ça change souvent.
- **Un seul rôle utilisateur** : pas de système de rôles complexe sauf si c'est le cœur du produit.
- **Schéma DB simple** : pas de normalisation excessive ; une table claire vaut mieux que cinq tables sur-optimisées.
- **Tests sur le chemin critique uniquement** : couvrir login, création et suppression de la ressource principale, paiement si applicable.

### Ce qu'on ne fait pas

- **Pas d'abstraction prématurée** : trois fichiers similaires sont acceptables — ne pas extraire tant que le pattern n'est pas stable.
- **Pas d'optimisation sans mesure** : pas de cache, pagination, ou lazy-loading sauf si la lenteur est observable par l'utilisateur.
- **Pas de feature flags** : pas d'infrastructure A/B, pas de toggles — changer le code directement.
- **Pas de i18n** : tout en français ou en anglais selon le produit, pas de système de traduction.
- **Pas de backward compatibility** : on peut casser des APIs internes sans shim ni couche de compatibilité.
- **Pas de gestion d'erreur exhaustive** : valider aux frontières (input utilisateur, réponses Supabase), pas dans le code interne.
- **Pas de logging applicatif élaboré** : `console.error` suffit pour le MVP ; pas de service de log externe.
- **Pas d'infra multi-tenant complexe** : RLS Supabase + `user_id` couvre 90% des besoins d'isolation.

### Arbitrages fréquents

| Question | Réponse MVP |
|---|---|
| Créer un hook réutilisable ou dupliquer ? | Dupliquer si utilisé < 3 fois |
| Pagination ou tout charger ? | Tout charger jusqu'à ce que ça rame |
| Validation client + serveur ou serveur seul ? | Serveur seul via Server Action |
| UI parfaite ou UI fonctionnelle ? | Fonctionnelle d'abord, soignée ensuite |
| Gestion des erreurs réseau ? | Message générique, log en console |

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

## Skills

Skills installés dans `.claude/skills/`. Invoquer avec `/nom-du-skill [argument]`.

| Skill | Argument | Quand l'utiliser |
|---|---|---|
| `/nextjs-best-practices` | — | **Auto-invoke** sur tout fichier Next.js (pages, layouts, Server/Client Components, Server Actions, route handlers, middleware) |
| `/new-page` | `<nom> <publique\|protégée>` | Créer une page dans `(auth)/` ou `(dashboard)/` avec le bon template auth |
| `/new-feature` | `<nom>` | Scaffolder une feature complète : route protégée + composant + Server Action + types |
| `/new-migration` | `<description>` | Créer un fichier SQL numéroté dans `supabase/migrations/` avec RLS inclus |
| `/supabase-rls` | `<table>` | Générer les politiques RLS complètes (select/insert/update/delete) pour une table |
| `/supabase-postgres-best-practices` | — | Optimiser des requêtes SQL, concevoir un schéma ou auditer les performances Postgres |
