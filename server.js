const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

// Connexion à PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bibliotech',
  password: '123456',
  port: 5432,
});

// ==================== CRUD PRINCIPAL ====================

// GET /livres?disponible=true — Liste avec filtre optionnel
app.get('/livres', async (req, res) => {
  try {
    const { disponible } = req.query;

    let query = 'SELECT * FROM livres';
    const params = [];

    if (disponible !== undefined) {
      const dispo = disponible === 'true';
      query += ' WHERE disponible = $1';
      params.push(dispo);
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /livres/search?categorie=Romans — Recherche par catégorie
app.get('/livres/search', async (req, res) => {
  try {
    const { categorie } = req.query;

    if (!categorie) {
      return res.status(400).json({ message: 'Paramètre "categorie" requis' });
    }

    const result = await pool.query(
      'SELECT * FROM livres WHERE LOWER(categorie) = LOWER($1) ORDER BY id ASC',
      [categorie]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /livres/:id — Un livre par ID
app.get('/livres/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM livres WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /livres — Ajouter un livre
app.post('/livres', async (req, res) => {
  try {
    const { titre, auteur, categorie, annee_publication, disponible } = req.body;

    const result = await pool.query(
      `INSERT INTO livres (titre, auteur, categorie, annee_publication, disponible)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titre, auteur, categorie, annee_publication, disponible ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /livres/:id — Modifier un livre
app.put('/livres/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, auteur, categorie, annee_publication, disponible } = req.body;

    const result = await pool.query(
      `UPDATE livres
       SET titre = $1,
           auteur = $2,
           categorie = $3,
           annee_publication = $4,
           disponible = $5
       WHERE id = $6
       RETURNING *`,
      [titre, auteur, categorie, annee_publication, disponible, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /livres/:id — Supprimer un livre
app.delete('/livres/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM livres WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    res.json({ message: 'Livre supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ==================== STATISTIQUES ====================

// GET /stats/total — Nombre total de livres
app.get('/stats/total', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM livres');
    res.json({ total: parseInt(result.rows[0].total, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log('✅ Serveur BiblioTech démarré sur http://localhost:3000');
});
