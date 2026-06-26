-- ============================================
-- Script de création de la base de données
-- BiblioTech - Gestion de bibliothèque municipale
-- ============================================

-- 1. Créer la base de données (à exécuter dans psql ou pgAdmin)
-- CREATE DATABASE bibliotech;

-- 2. Se connecter à la base bibliotech puis exécuter :

CREATE TABLE IF NOT EXISTS livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    annee_publication INTEGER NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insérer 10 livres de démonstration
INSERT INTO livres (titre, auteur, categorie, annee_publication, disponible) VALUES
    ('Le Petit Prince',              'Antoine de Saint-Exupéry', 'Jeunesse',        1943, true),
    ('1984',                         'George Orwell',            'Science-Fiction',  1949, true),
    ('Clean Code',                   'Robert C. Martin',         'Informatique',     2008, true),
    ('Harry Potter à l''école des sorciers', 'J.K. Rowling',   'Fantasy',          1997, true),
    ('Les Misérables',               'Victor Hugo',              'Roman',            1862, false),
    ('Le Procès',                    'Franz Kafka',              'Roman',            1925, true),
    ('Dune',                         'Frank Herbert',            'Science-Fiction',  1965, true),
    ('Orgueil et Préjugés',          'Jane Austen',              'Roman',            1813, true),
    ('Le Seigneur des Anneaux',      'J.R.R. Tolkien',           'Fantasy',          1954, true),
    ('Introduction à l''algorithmique', 'Thomas H. Cormen',     'Informatique',     1990, true);
