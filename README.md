# MimoBot Web — Site de cours d'anglais CEM

Plateforme web pour les cours d'anglais des collèges (CEM) en Algérie.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Style**: Tailwind CSS v4
- **Auth**: Supabase Auth (email/password)
- **Base de données**: Supabase (PostgreSQL + pgvector)
- **Déploiement**: Vercel (free tier)

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Connexion |
| `/register` | Inscription |
| `/dashboard` | Tableau de bord |
| `/lessons` | Gestion des leçons |
| `/lessons/new` | Nouvelle leçon |
| `/exercises` | Exercices interactifs |
| `/exercises/new` | Nouvel exercice |
| `/resources` | Ressources PDF |
| `/profile` | Profil utilisateur |

## API (agent bot)

| Route | Méthode | Description |
|---|---|---|
| `/api/agent/users/list` | GET | Liste des utilisateurs |
| `/api/agent/users/add` | POST | Ajouter un utilisateur |
| `/api/agent/users/remove` | POST | Supprimer un utilisateur |
| `/api/agent/users/premium` | POST | Changer rôle utilisateur |
| `/api/agent/files/list` | GET | Liste des fichiers |
| `/api/agent/files/upload` | POST | Ajouter un fichier |
| `/api/agent/files/delete` | POST | Supprimer un fichier |
| `/api/agent/stats` | GET | Statistiques |

## Installation

```bash
cd site
npm install
npm run dev
```

## Variables d'environnement

Voir `.env.local.example` — copier vers `.env.local` avec les vraies clés.

## Base de données

Le fichier `supabase/migrations/00001_init.sql` contient le schéma SQL à exécuter dans Supabase.

## Connexion avec le bot Telegram

Le bot MimoBot utilise les endpoints `/api/agent/*` via le header `X-Agent-Secret`.
