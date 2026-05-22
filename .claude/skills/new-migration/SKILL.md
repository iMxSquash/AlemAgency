# Skill: new-migration

Crée un fichier de migration Supabase correctement numéroté pour le projet AlemAgency.

## Ce que tu reçois

L'utilisateur décrit la migration à créer (ex: `/new-migration ajouter table projects`).

## Étapes

### 1. Trouver le prochain numéro

Lister les fichiers dans `supabase/migrations/` et prendre le numéro le plus élevé + 1.
Format : `00001`, `00002`, etc. (5 chiffres avec zéros).

### 2. Nommer le fichier

`supabase/migrations/<NNNNN>_<description_en_snake_case>.sql`

Ex : `00002_add_projects_table.sql`

### 3. Contenu du fichier

Template à adapter selon la migration demandée :

```sql
-- <Description de ce que fait cette migration>
create table if not exists public.<table> (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  -- colonnes métier ici
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.<table> enable row level security;

create policy "Users can view their own <table>"
  on public.<table> for select
  using (auth.uid() = user_id);

create policy "Users can insert their own <table>"
  on public.<table> for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own <table>"
  on public.<table> for update
  using (auth.uid() = user_id);

create policy "Users can delete their own <table>"
  on public.<table> for delete
  using (auth.uid() = user_id);

-- Trigger updated_at
create trigger <table>_updated_at
  before update on public.<table>
  for each row execute procedure public.handle_updated_at();
```

## Règles

- Toujours activer RLS sur chaque nouvelle table
- Toujours ajouter `created_at` et `updated_at`
- Toujours ajouter le trigger `updated_at` (la fonction `handle_updated_at()` existe déjà depuis `00001_init.sql`)
- Utiliser `if not exists` pour l'idempotence
- Si la migration modifie une table existante (ALTER), ne pas inclure le template de création complet — adapter au besoin
