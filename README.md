# BiblioTech

API REST de gestion de catalogue de livres pour une bibliothèque municipale.

## Stack technique

- Node.js
- Express.js
- PostgreSQL
- Bibliothèque `pg`

## Installation

```bash
# 1. Cloner le projet
cd BiblioTech

# 2. Installer les dépendances
npm install
```

## Base de données

```bash
# 1. Créer la base de données PostgreSQL
psql -U postgres -c "CREATE DATABASE bibliotech;"

# 2. Créer la table et insérer des données de test
psql -U postgres -d bibliotech -f db.sql
```

**Configuration** : Modifier les identifiants de connexion dans `server.js` :

```js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bibliotech',
  password: 'votre_mot_de_passe',
  port: 5432,
});
```

## Lancement

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`.

## Endpoints

### CRUD Livres

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/livres` | Liste tous les livres |
| GET | `/livres?disponible=true` | Filtrer par disponibilité |
| GET | `/livres/:id` | Détail d'un livre |
| GET | `/livres/search?categorie=Romans` | Recherche par catégorie |
| POST | `/livres` | Ajouter un livre |
| PUT | `/livres/:id` | Modifier un livre |
| DELETE | `/livres/:id` | Supprimer un livre |

### Statistiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats/total` | Nombre total de livres |

## Exemples de requêtes (Postman / cURL)

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
    "categorie": "Romans",
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
curl http://localhost:3000/livres/search?categorie=Romans
```

### Compter les livres

```bash
curl http://localhost:3000/stats/total
```

## Structure du projet

```
BiblioTech/
├── node_modules/
├── db.sql
├── package.json
├── README.md
└── server.js
```
