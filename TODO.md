# TODO — AlemAgency MVP

Répartition des tâches entre Noah, Omar et Elwen.
Priorité : livrer le chemin heureux en entier avant les edge cases.

**Décision technique** : le contenu des fiches est stocké en JSON statique (`src/lib/data/resources.json`).
La page détail est un template qui rend ce JSON — pas de table `resources` en base.
Seules les interactions utilisateur (sauvegardes, progression) vont en base Supabase.

---

## Elwen — Base de données + Fiches

### Données JSON
- [x] Créer `src/lib/data/resources.json` — 12 fiches de démo (TSA, TDAH, DYS, TDI)
- [x] Créer `src/lib/data/categories.json` — liste des catégories avec `slug`, `label`, `color`
- [x] Types TypeScript dans `src/types/index.ts` : `Resource`, `ContentSection`, `ResourceCategory`, `ResourceType`

### Migrations & schéma
- [x] Migration `saved_resources` — `id, user_id, resource_slug, saved_at`
- [x] Migration `reading_progress` — `id, user_id, resource_slug, started_at, completed_at` (null = pas terminé)
- [x] RLS sur les 2 tables — appliqué en base via MCP

### Page fiche individuelle
- [x] Route `/bibliotheque/[slug]` — template qui rend `resources.json` selon le slug
- [x] Rendu des sections JSON : `text`, `list`, `steps`, `tip`, `warning`
- [x] Bouton "Sauvegarder" (Server Action : insert dans `saved_resources`)
- [x] Bouton "Marquer comme terminé" (Server Action : update `reading_progress.completed_at`)
- [x] Marquer automatiquement comme "en cours" à l'ouverture si pas déjà lu

### Page fiches sauvegardées
- [x] Route `/mes-fiches` — lit les slugs dans `saved_resources`, retrouve les fiches dans le JSON
- [x] Route `/en-cours` — fiches en cours de lecture (progress sans `completed_at`)
- [x] Bouton "Retirer des sauvegardes"

---

## Noah — Authentification

### Pages
- [ ] Page `/connexion` — formulaire email + mot de passe
- [ ] Page `/inscription` — formulaire email + mot de passe + confirmation
- [ ] Redirection post-login vers `/bibliotheque`
- [ ] Redirection post-logout vers `/connexion`

### Supabase Auth
- [ ] `signInWithPassword` en Server Action
- [ ] `signUp` en Server Action
- [ ] `signOut` en Server Action
- [ ] Gestion des erreurs : email déjà pris, mauvais mot de passe (message générique)

### Protection des routes
- [ ] Middleware auth guard : rediriger `/bibliotheque/*` et `/mes-fiches` vers `/connexion` si non connecté
- [ ] Rediriger `/connexion` et `/inscription` vers `/bibliotheque` si déjà connecté

---

## Omar — Bibliothèque (liste + recherche + filtres)

### Page bibliothèque
- [ ] Route `/bibliotheque` — charge `resources.json` côté serveur, grille de cards
- [ ] Composant `ResourceCard` — titre, catégorie (pastille colorée), type, durée estimée
- [ ] État visuel "Sauvegardée" sur la card (comparaison avec `saved_resources` de l'utilisateur)
- [ ] État visuel "En cours" si `reading_progress` existe sans `completed_at`
- [ ] État visuel "Lu" si `completed_at` est renseigné

### Recherche & filtres (Client Component)
- [ ] Input de recherche — filtre sur `title` + `description` au keystroke
- [ ] Pastilles de tri : Toutes | Autisme | TDAH | Dyslexie | Comportement | Motricité
- [ ] Sélection multiple des catégories
- [ ] Combinaison recherche + filtre catégorie

---

## Commun — à faire ensemble au kick-off

- [x] Types TypeScript validés par les 3 (structure `ContentSection` du JSON) avant de coder
- [x] Créer les branches : `feat/auth` (Noah), `feat/bibliotheque` (Omar), `feat/fiches` (Elwen)
