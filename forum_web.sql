-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 14 mai 2026 à 15:06
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `forum_web`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conferences`
--

CREATE TABLE `conferences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `salle` varchar(100) NOT NULL,
  `speaker` varchar(255) NOT NULL,
  `speaker_id` bigint(20) UNSIGNED DEFAULT NULL,
  `max_participants` int(11) NOT NULL DEFAULT 60,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `conferences`
--

INSERT INTO `conferences` (`id`, `titre`, `description`, `date`, `heure_debut`, `heure_fin`, `salle`, `speaker`, `speaker_id`, `max_participants`, `created_at`, `updated_at`) VALUES
(5, 'Collaboration, communication unifiée et architectures hybrides IA', 'Atelier abordant les nouvelles dynamiques de collaboration en entreprise, les solutions de communication unifiée et l\'intégration de l\'IA au sein d\'architectures hybrides.', '2025-11-12', '10:00:00', '15:00:00', 'Code 212', 'M. Souhail Godari', 6, 60, '2026-05-14 11:44:43', '2026-05-14 12:55:15'),
(6, 'De l\'innovation à la résilience - Cybersecurity Mesh', 'Atelier explorant le concept du Cybersecurity Mesh et son rôle stratégique dans le renforcement de la résilience des systèmes d\'information.', '2025-11-12', '10:00:00', '15:00:00', 'Code 212', 'M. Nabil Ladib', 7, 60, '2026-05-14 11:46:01', '2026-05-14 12:03:38');

-- --------------------------------------------------------

--
-- Structure de la table `inscriptions`
--

CREATE TABLE `inscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `conference_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `inscriptions`
--

INSERT INTO `inscriptions` (`id`, `user_id`, `conference_id`, `created_at`, `updated_at`) VALUES
(7, 9, 5, '2026-05-14 12:05:12', '2026-05-14 12:05:12'),
(8, 9, 6, '2026-05-14 12:05:13', '2026-05-14 12:05:13');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2024_01_01_000001_create_users_table', 1),
(2, '2024_01_01_000002_create_conferences_table', 1),
(3, '2024_01_01_000003_create_stands_table', 1),
(4, '2024_01_01_000004_create_inscriptions_table', 1),
(5, '2024_01_01_000005_create_programmes_table', 1),
(6, '2024_01_01_000006_create_system_tables', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `programmes`
--

CREATE TABLE `programmes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `contenu` text NOT NULL,
  `fichier_nom` varchar(255) DEFAULT NULL,
  `fichier_path` varchar(255) DEFAULT NULL,
  `fichier_type` varchar(255) DEFAULT NULL,
  `publie` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `programmes`
--

INSERT INTO `programmes` (`id`, `titre`, `contenu`, `fichier_nom`, `fichier_path`, `fichier_type`, `publie`, `created_at`, `updated_at`) VALUES
(1, 'Programme de la journée de Forum Ensaj Entreprises', 'JOUR 1\n09:00 – 10:00 : Cérémonie d\'ouverture du Forum\nMot des officiels\nSignature des conventions de partenariat\nRemise des prix de la compétition Innov\'Boost\n10:00 – 10:30 : Inaugurations officielles\nInauguration des stands\nInauguration de l\'Incubateur EMC2\nInauguration CODE 212\n10:30 – 11:00 : Pause café & Networking\n11:00 – 13:30 : Visite des stands & Networking\n13:30 – 14:30 : Déjeuner\n14:30 – 15:30 : Table ronde --Thème : Ingénierie Innovante : Nouveaux leviers pour la performance des entreprises\n15:30 – 16:30 : Table ronde --Thème : L\'art de recruter et d\'être recruté : clés pour une employabilité durable\n16:30 – 17:00 : Recrutement & Networking\nJOUR 2\n10:00 – 15:00 : Ateliers & Tables rondes -- Innovation, employabilité & entrepreneuriat\n15:00 – 15:30 : Clôture du Forum', 'Forum_Planning.png', 'programmes/nGWDsmx9xNHy34eVQKGQr94KpdBZvFAQh3sTpGl8.png', 'image/png', 1, '2026-05-04 22:07:58', '2026-05-14 11:30:42');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stands`
--

CREATE TABLE `stands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `entreprise` varchar(255) DEFAULT NULL,
  `entreprise_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `stands`
--

INSERT INTO `stands` (`id`, `nom`, `description`, `disponible`, `entreprise`, `entreprise_id`, `created_at`, `updated_at`) VALUES
(1, 'Stand A1', 'Espace 20m² — Entrée principale, grande visibilité', 0, 'Fortinet', 8, '2026-05-04 22:07:58', '2026-05-14 12:02:48'),
(3, 'Stand C2', '25m² avec électricité et connexion réseau — Idéal démos', 1, NULL, NULL, '2026-05-04 22:07:58', '2026-05-04 22:07:58'),
(4, 'Stand D5', '18m² — Coin tranquille, parfait pour entretiens et networking', 1, NULL, NULL, '2026-05-04 22:07:58', '2026-05-04 22:07:58');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','etudiant','entreprise','conferencier') NOT NULL DEFAULT 'etudiant',
  `bio` text DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `password`, `role`, `bio`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Salon', 'admin@salon.ma', '$2y$12$tvYYqaWPTsjze.lIRtFXzuIWEPyn5P4kVj1M73Ce1dbXK.J2HMJie', 'admin', NULL, NULL, '2026-05-04 22:07:56', '2026-05-14 11:20:32'),
(6, 'M. Souhail Godari', 'souhail@ensa.ma', '$2y$12$SZfpE5U3p8PzZtDFivGMHePLuaJyzBmWFF3/0V6EB6C9aiZWmFbtK', 'conferencier', NULL, NULL, '2026-05-14 11:52:38', '2026-05-14 11:52:38'),
(7, 'M. Nabil Ladib', 'nabil@ensa.ma', '$2y$12$a/l86Jr4B12IQ9oKetUAFO1E5f502l02sxBz9rGscLpo0mqqrLWne', 'conferencier', NULL, NULL, '2026-05-14 12:00:09', '2026-05-14 12:00:09'),
(8, 'Fortinet', 'fortinet@ensa.ma', '$2y$12$Avhb.QMnZaiVczRDwKVAh.SZUndPlPyEJFYed06qDbCQVxJQwC4RG', 'entreprise', NULL, NULL, '2026-05-14 12:02:14', '2026-05-14 12:02:14'),
(9, 'Maryem EL HAOUD', 'maryem@ensa.ma', '$2y$12$xcIVe1rf34/feMvWiGlWW.2FwPn7LarODby0Z0Boql7KeA0bkmMAe', 'etudiant', NULL, NULL, '2026-05-14 12:04:54', '2026-05-14 12:04:54');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `conferences`
--
ALTER TABLE `conferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `speaker_id` (`speaker_id`);

--
-- Index pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inscriptions_user_conference_unique` (`user_id`,`conference_id`),
  ADD KEY `conference_id` (`conference_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `programmes`
--
ALTER TABLE `programmes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `stands`
--
ALTER TABLE `stands`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entreprise_id` (`entreprise_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `conferences`
--
ALTER TABLE `conferences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `programmes`
--
ALTER TABLE `programmes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `stands`
--
ALTER TABLE `stands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `conferences`
--
ALTER TABLE `conferences`
  ADD CONSTRAINT `conferences_ibfk_1` FOREIGN KEY (`speaker_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD CONSTRAINT `inscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscriptions_ibfk_2` FOREIGN KEY (`conference_id`) REFERENCES `conferences` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stands`
--
ALTER TABLE `stands`
  ADD CONSTRAINT `stands_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
