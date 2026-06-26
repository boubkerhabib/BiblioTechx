const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// ==================== CRUD PRINCIPAL ====================

// POST /livres — Ajouter un livre
app.post('/livres', async (req, res) => {
  try {
    const { titre, auteur, categorie, annee_publication, disponible } = req.body;

    // Validation des champs obligatoires
    if (!titre || !auteur || !categorie || annee_publication == null) {
      return res.status(400).json({
        message: 'Champs obligatoires : titre, auteur, categorie, annee_publication',
      });
    }

    if (typeof annee_publication !== 'number' || !Number.isInteger(annee_publication)) {
      return res.status(400).json({
        message: 'annee_publication doit être un nombre entier',
      });
    }

    const [titreN, auteurN, categorieN] = [titre, auteur, categorie].map(s => s.trim());
    if (!titreN || !auteurN || !categorieN) {
      return res.status(400).json({
        message: 'Les champs titre, auteur et categorie ne peuvent pas être vides',
      });
    }

    const result = await pool.query(
      `INSERT INTO livres (titre, auteur, categorie, annee_publication, disponible)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titreN, auteurN, categorieN, annee_publication, disponible ?? true]
    );

    res.status(201).json({
      message: 'Livre créé avec succès',
      livre: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /livres — Liste tous les livres (avec filtre disponibilité optionnel)
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

// GET /livres/search?categorie=Roman — Recherche par catégorie
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

// GET /livres/:id — Détail d'un livre
app.get('/livres/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const result = await pool.query('SELECT * FROM livres WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    res.json(result.rows[0]);
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

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    // Validation des champs obligatoires
    if (!titre || !auteur || !categorie || annee_publication == null) {
      return res.status(400).json({
        message: 'Champs obligatoires : titre, auteur, categorie, annee_publication',
      });
    }

    if (typeof annee_publication !== 'number' || !Number.isInteger(annee_publication)) {
      return res.status(400).json({
        message: 'annee_publication doit être un nombre entier',
      });
    }

    const [titreN, auteurN, categorieN] = [titre, auteur, categorie].map(s => s.trim());
    if (!titreN || !auteurN || !categorieN) {
      return res.status(400).json({
        message: 'Les champs titre, auteur et categorie ne peuvent pas être vides',
      });
    }

    const result = await pool.query(
      `UPDATE livres
       SET titre = $1,
           auteur = $2,
           categorie = $3,
           annee_publication = $4,
           disponible = $5
       WHERE id = $6
       RETURNING *`,
      [titreN, auteurN, categorieN, annee_publication, disponible ?? true, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    res.json({
      message: 'Livre modifié avec succès',
      livre: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /livres/:id — Supprimer un livre
app.delete('/livres/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({ message: 'ID invalide' });
    }

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

// ==================== GESTION 404 ====================

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// ==================== DÉMARRAGE ====================

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.listen(PORT, () => {
  console.log(`Serveur BiblioTech démarré sur http://localhost:${PORT}`);
});
