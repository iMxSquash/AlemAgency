# Skill: supabase-rls

Génère les politiques RLS Supabase complètes pour une table du projet AlemAgency.

## Ce que tu reçois

L'utilisateur donne le nom d'une table (ex: `/supabase-rls projects`).

## Ce que tu dois faire

### 1. Identifier la structure de la table

Lire le fichier de migration correspondant dans `supabase/migrations/` pour comprendre :
- Les colonnes de la table
- La colonne qui référence l'utilisateur (typiquement `user_id` → `profiles.id`)
- Si la table est partagée entre utilisateurs (ex: table `teams` avec une table pivot)

### 2. Générer les politiques

#### Cas standard — table appartenant à un utilisateur (`user_id`)

```sql
-- Activer RLS
alter table public.<table> enable row level security;

-- SELECT : l'utilisateur voit ses propres lignes
create policy "<table>_select_own"
  on public.<table> for select
  using (auth.uid() = user_id);

-- INSERT : l'utilisateur ne peut insérer que pour lui-même
create policy "<table>_insert_own"
  on public.<table> for insert
  with check (auth.uid() = user_id);

-- UPDATE : l'utilisateur ne peut modifier que ses lignes
create policy "<table>_update_own"
  on public.<table> for update
  using (auth.uid() = user_id);

-- DELETE : l'utilisateur ne peut supprimer que ses lignes
create policy "<table>_delete_own"
  on public.<table> for delete
  using (auth.uid() = user_id);
```

#### Cas table publique en lecture (ex: `plans`, `categories`)

```sql
alter table public.<table> enable row level security;

create policy "<table>_select_all"
  on public.<table> for select
  using (true);
```

#### Cas accès admin via service role

Les opérations via `SUPABASE_SERVICE_ROLE_KEY` bypassent le RLS — pas besoin de politique spéciale.

### 3. Où placer le SQL généré

- Si la table est nouvelle → dans la migration qui la crée
- Si la table existe et manque de politiques → créer une nouvelle migration :
  `supabase/migrations/<prochain_numero>_rls_<table>.sql`

## Vérifications à faire

- `alter table ... enable row level security` est présent
- Chaque opération (select/insert/update/delete) a sa politique si nécessaire
- Les noms de politiques sont uniques et descriptifs
- `using()` pour SELECT/UPDATE/DELETE, `with check()` pour INSERT (et UPDATE si besoin de valider la nouvelle valeur)
