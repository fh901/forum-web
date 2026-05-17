# Forum ENSAJ Entreprises — Application Web

## Technologies
- Front-end : ReactJS + Vite + Axios
- Back-end : Laravel 11 + Sanctum
- Base de données : MySQL

## Installation

### Backend
cd forum_backend
composer install
php artisan key:generate
php artisan storage:link
php artisan serve

### Frontend
cd forum_frontend
npm install
npm run dev

### inserer la base de donnees du fichier .sql dans phpmyadmin avant de lancer le site et veuillez que le fichier .env aie le nom de votre base de donnees et le port correcte 

## Fonctionnalités
- Authentification multi-rôles (Admin, Étudiant, Entreprise, Conférencier)
- Gestion des conférences (CRUD)
- Gestion des stands (réservation)
- Programme du forum
- Espace personnel par rôle