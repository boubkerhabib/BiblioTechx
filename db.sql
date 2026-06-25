-- ============================================
-- Script de création de la base de données
-- BiblioTech - Gestion de bibliothèque
-- ============================================

-- 1. Créer la base de données (à exécuter dans psql ou pgAdmin)
-- CREATE DATABASE bibliotech;

-- 2. Se connecter à la base bibliotech puis exécuter :

CREATE TABLE IF NOT EXISTS livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    annee_publication INT,
    disponible BOOLEAN DEFAULT TRUE
);

-- 3. (Optionnel) Insérer des données de test
INSERT INTO livres (titre, auteur, categorie, annee_publication, disponible)
VALUES
    ('Le Petit Prince',        'Antoine de Saint-Exupéry', 'Romans',       1943, true),
    ('1984',                   'George Orwell',            'Romans',       1949, true),
    ('Clean Code',             'Robert C. Martin',         'Informatique', 2008, true),
    ('Harry Potter à l''école des sorciers', 'J.K. Rowling', 'Fantasy', 1997, true),
    ('Les Misérables',         'Victor Hugo',              'Romans',       1862, false);
