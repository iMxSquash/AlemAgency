# AlemAgency

SaaS built with Next.js 15, Supabase.

## Stack

Chaque techno est choisie pour **réduire le temps entre l'idée et la mise en production**.

| Techno | Pourquoi |
|---|---|
| **Next.js 15** | App Router + Server Components = moins de JS côté client, moins de fetching manuel. Turbopack rend le dev quasi-instantané. |
| **TypeScript strict** | Les erreurs sont attrapées à l'écriture, pas en prod. Réduit le coût des refactos futurs. |
| **Tailwind CSS v4** | Pas de fichiers CSS à maintenir. Le style vit dans le composant, le feedback est immédiat. |
| **Supabase** | Auth, base de données PostgreSQL et API REST/Realtime livrés en quelques minutes. Pas de backend à écrire soi-même. RLS remplace une couche d'autorisation entière. |
| **Biome** | Lint + format en un seul outil, 10× plus rapide qu'ESLint + Prettier. Zéro configuration de compromis. |
| **Vitest + Playwright** | Tests unitaires rapides avec Vitest (compatible Vite/Turbopack), e2e fiables avec Playwright. On ship avec confiance. |

## Getting started

```bash
cp .env.example .env
# Fill in .env with your Supabase and Stripe keys

npm install
npm run dev
```

## Environment variables

See `.env.example` for the full list.
