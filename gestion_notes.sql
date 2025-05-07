-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 07 mai 2025 à 09:52
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_notes`
--

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE `matieres` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`) VALUES
(1, 'Communication web'),
(3, 'Programmation orientée objet'),
(4, 'Cybersécurité'),
(5, 'Design d’interaction'),
(6, 'Gestion de projet'),
(7, 'Bases de données'),
(8, 'Systèmes embarqués'),
(9, 'Psychologie cognitive');

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `id_eleve` int(11) DEFAULT NULL,
  `id_prof` int(11) DEFAULT NULL,
  `id_matiere` int(11) DEFAULT NULL,
  `note` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notes`
--

INSERT INTO `notes` (`id`, `id_eleve`, `id_prof`, `id_matiere`, `note`) VALUES
(1, 1, 3, 7, 16.5),
(2, 2, 3, 1, 14),
(3, 6, 3, 1, 15.5),
(4, 7, 3, 1, 17),
(5, 8, 5, 1, 13.5),
(10, 9, 3, 6, 11),
(11, 2, 3, 6, 13),
(12, 6, 3, 6, 14),
(13, 9, 3, 6, 15.5),
(14, 9, 4, 4, 16),
(15, 8, 4, 4, 15),
(16, 7, 5, 4, 14),
(17, 2, 4, 3, 12.5),
(18, 9, 5, 3, 13),
(19, 6, 5, 3, 15.5);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `identifiant` varchar(100) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `role` enum('eleve','prof') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `identifiant`, `mot_de_passe`, `role`) VALUES
(1, 'GARNIER', 'Mathis', 'matgarnier@ensc.fr', 'christophe4ever', 'eleve'),
(2, 'BENOIS', 'Elian', 'ebenois@ensc.fr', 'ilovekiki', 'eleve'),
(3, 'PLACIN', 'Frederique', 'freplacin@ensc.fr', 'champi4ever', 'prof'),
(4, 'VERDIER', 'Julien', 'jverdier@ensc.fr', 'promaster', 'prof'),
(5, 'DUPONT', 'Claire', 'cdupont@ensc.fr', 'dataqueen', 'prof'),
(6, 'KABORE', 'Aïcha', 'akabore@ensc.fr', 'securepass123', 'eleve'),
(7, 'LAMBERT', 'Sophie', 'slambert@ensc.fr', 'soso2025', 'eleve'),
(8, 'TOUZET', 'Lucas', 'ltouzet@ensc.fr', 'lucasnotes', 'eleve'),
(9, 'MARTIN', 'Nathan', 'nmartin@ensc.fr', 'nathan456', 'eleve');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_eleve` (`id_eleve`),
  ADD KEY `id_prof` (`id_prof`),
  ADD KEY `id_matiere` (`id_matiere`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`id_eleve`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`id_prof`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`id_matiere`) REFERENCES `matieres` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
