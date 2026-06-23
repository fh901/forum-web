# Forum ENSAJ Entreprises

Application web de gestion du Forum ENSAJ Entreprises — backend Laravel + frontend React.
realisé par : 
- Hsina fatima ezzahraa
-el haoud  maryem 

---

## Prérequis

Installer avant de commencer :

- [XAMPP](https://www.apachefriends.org/) (PHP + MySQL)
- [Node.js](https://nodejs.org/)
- [Composer](https://getcomposer.org/)

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/fh901/forum-web.git
cd forum-web
```

---

### 2. Configurer le Backend

```bash
cd forum_backend
composer install
copy .env.example .env
php artisan key:generate
php artisan storage:link
```

Ouvre le fichier `.env` et vérifie ces lignes :

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=forum_web
DB_USERNAME=root
DB_PASSWORD=
```

Lance les migrations et les données de test :

```bash
php artisan migrate:fresh --seed
```

Démarre le serveur Laravel :

```bash
php artisan serve
```

---

### 3. Configurer le Frontend

Ouvre un **nouveau terminal** :

```bash
cd forum_frontend
npm install
npm run dev
```

---

## Accéder au site

Ouvre le navigateur sur **http://localhost:5173**

---

## Comptes disponibles

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@salon.ma | admin123 | Admin |
| souhail@ensa.ma | souhail123 | Conférencier |
| nabil@ensa.ma | nabil123 | Conférencier |
| fortinet@ensa.ma | fortinet123 | Entreprise |
| maryem@ensa.ma | maryem123 | Étudiant |
| fatima@ensa.ma | fatima123 | Étudiant |
