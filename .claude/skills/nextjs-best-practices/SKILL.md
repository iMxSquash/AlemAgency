---
name: nextjs-best-practices
description: Next.js 15 App Router best practices for AlemAgency. Auto-invoke when writing, reviewing, or editing any Next.js file — pages, layouts, Server Components, Client Components, Server Actions, route handlers, or middleware. Apply these rules proactively without being asked.
metadata:
  author: AlemAgency
  version: "1.0.0"
  date: May 2026
---

# Next.js 15 App Router — Best Practices

Rules for writing correct, performant Next.js 15 code in the AlemAgency project (App Router, TypeScript strict, Supabase SSR).

## When to Apply

Apply these rules automatically when:
- Creating or editing a page, layout, or component in `src/app/`
- Writing Server Components or Client Components
- Writing Server Actions (`"use server"`)
- Writing route handlers (`route.ts`)
- Editing `src/middleware.ts`
- Reviewing any `.tsx` or `.ts` file under `src/`

## Rule Categories

| Priority | Category | Reference |
|---|---|---|
| 1 | Server vs Client Components | `references/server-client.md` |
| 2 | Server Actions | `references/server-actions.md` |
| 3 | Data Fetching | `references/data-fetching.md` |
| 4 | Auth & Middleware | `references/auth-middleware.md` |
| 5 | Performance | `references/performance.md` |

## Quick Reference

### Server vs Client
- Default: Server Component. Add `"use client"` only when using hooks, browser APIs, or event handlers.
- Never import a Server Component inside a Client Component directly — pass it as `children` prop instead.

### Server Actions
- Always `"use server"` at top of file or function.
- Always verify auth at the start of every action.
- Return `{ data, error }` — never throw.

### Data Fetching
- Fetch in Server Components, pass data down as props.
- Use `Promise.all()` for parallel fetches.
- Never fetch in Client Components — use Server Actions or route handlers instead.

### Auth
- Use `createClient()` from `@/lib/supabase/server` in Server Components and actions.
- Use `createClient()` from `@/lib/supabase/client` in Client Components only.
- Never use the service role key client-side.

### Performance
- Add `loading.tsx` next to heavy pages.
- Use `<Suspense>` to wrap slow data-fetching components.
- Prefer `generateStaticParams` for static routes.
