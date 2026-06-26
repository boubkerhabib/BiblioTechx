# BiblioTech

API REST de gestion de catalogue de livres pour une bibliothèque municipale.

## Stack technique

- Node.js
- Express.js
- PostgreSQL
- Bibliothèque `pg` (sans ORM)
- `dotenv` pour la configuration

## Installation

```bash
# 1. Cloner le projet
cd BiblioTech

# 2. Installer les dépendances
npm install
```

## Configuration

Copier le fichier `.env.example` vers `.env` et modifier les identifiants :

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=bibliotech
PORT=3000
```

## Base de données

```bash
# 1. Créer la base de données PostgreSQL
psql -U postgres -c "CREATE DATABASE bibliotech;"

# 2. Créer la table et insérer les données de démonstration
psql -U postgres -d bibliotech -f database.sql
```

## Lancement

```bash
# Mode production
npm start

# Mode développement (avec rechargement automatique)
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Endpoints de l'API

### CRUD Livres

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/livres` | Liste tous les livres |
| GET | `/livres?disponible=true` | Filtrer par disponibilité |
| GET | `/livres/:id` | Détail d'un livre |
| GET | `/livres/search?categorie=Roman` | Recherche par catégorie |
| POST | `/livres` | Ajouter un livre |
| PUT | `/livres/:id` | Modifier un livre |
| DELETE | `/livres/:id` | Supprimer un livre |

### Statistiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats/total` | Nombre total de livres |

## Exemples de requêtes (cURL)

### Ajouter un livre

```bash
curl -X POST http://localhost:3000/livres \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Dune",
    "auteur": "Frank Herbert",
    "categorie": "Science-Fiction",
    "annee_publication": 1965,
    "disponible": true
  }'
```

### Modifier un livre

```bash
curl -X PUT http://localhost:3000/livres/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Le Petit Prince",
    "auteur": "Antoine de Saint-Exupéry",
    "categorie": "Jeunesse",
    "annee_publication": 1943,
    "disponible": false
  }'
```

### Supprimer un livre

```bash
curl -X DELETE http://localhost:3000/livres/1
```

### Rechercher par catégorie

```bash
curl http://localhost:3000/livres/search?categorie=Roman
```

### Filtrer par disponibilité

```bash
curl http://localhost:3000/livres?disponible=true
```

### Compter les livres

```bash
curl http://localhost:3000/stats/total
```

## Structure du projet

```
BiblioTech/
├── .env.example
├── .gitignore
├── database.sql
├── db.js
├── package.json
├── README.md
└── server.js
```
