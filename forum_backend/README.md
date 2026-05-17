# Salon Web ENSA — Backend Laravel 11

API REST complète pour le projet Salon Web ENSA El Jadida.

---

## Prérequis

| Outil | Version minimale |
|---|---|
| PHP | 8.2 |
| Composer | 2.x |
| SQLite | (inclus dans PHP) ou MySQL 8+ |

---

## Installation — 5 étapes

### Étape 1 — Installer les dépendances

```bash
cd salon-api
composer install
```

### Étape 2 — Créer le fichier d'environnement

```bash
cp .env.example .env
php artisan key:generate
```

### Étape 3 — Base de données

**Option A — SQLite (développement, le plus simple)**

```bash
touch database/database.sqlite
```
> Le fichier `.env` est déjà configuré pour SQLite. Rien d'autre à faire.

**Option B — MySQL (production)**

Modifier `.env` :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=salon_web
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```
Créer la base :
```sql
CREATE DATABASE salon_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Étape 4 — Créer les tables et insérer les données

```bash
php artisan migrate --seed
```

Cette commande crée toutes les tables ET insère les données de démonstration
(identiques aux mocks du frontend).

### Étape 5 — Démarrer le serveur

```bash
php artisan serve
```

L'API est disponible sur **http://localhost:8000/api**

---

## Commande unique (après composer install)

```bash
cp .env.example .env && php artisan key:generate && touch database/database.sqlite && php artisan migrate --seed && php artisan serve
```

---

## Comptes de test (identiques aux mocks frontend)

| Email | Mot de passe | Rôle |
|---|---|---|
| admin@salon.ma | admin123 | Administrateur |
| contact@techcorp.ma | tech123 | Entreprise |
| ahmed@ensa.ma | ahmed123 | Étudiant |
| karim@ensa.ma | karim123 | Conférencier |

---

## Endpoints disponibles

### Publiques
| Méthode | URL | Description |
|---|---|---|
| POST | /api/login | Connexion |
| POST | /api/register | Inscription |
| POST | /api/forgot-password | Mot de passe oublié |
| POST | /api/reset-password | Réinitialiser le mot de passe |

### Protégées (Bearer Token)
| Méthode | URL | Rôle requis |
|---|---|---|
| POST | /api/logout | tous |
| GET | /api/me | tous |
| GET | /api/conferences | tous |
| POST | /api/conferences/{id}/inscrire | etudiant |
| DELETE | /api/conferences/{id}/inscrire | etudiant |
| POST | /api/conferences | admin |
| PUT | /api/conferences/{id} | admin |
| DELETE | /api/conferences/{id} | admin |
| GET | /api/stands | tous |
| POST | /api/stands/{id}/reserver | entreprise |
| DELETE | /api/stands/{id}/reserver | entreprise |
| POST | /api/stands | admin |
| PUT | /api/stands/{id} | admin |
| DELETE | /api/stands/{id} | admin |
| GET | /api/programme | tous |
| PUT | /api/programme | admin |
| POST | /api/programme/fichier | admin |
| DELETE | /api/programme/fichier | admin |
| GET | /api/mon-espace | tous |
| PUT | /api/mon-espace/bio | conferencier |
| GET | /api/admin/stats | admin |
| GET | /api/admin/users | admin |
| PUT | /api/admin/users/{id} | admin |
| DELETE | /api/admin/users/{id} | admin |

---

## Structure des dossiers

```
salon-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php       ← login, register, logout, forgot-password
│   │   │   ├── ConferenceController.php ← CRUD + inscrire/désinscrire
│   │   │   ├── StandController.php      ← CRUD + réserver/libérer
│   │   │   ├── ProgrammeController.php  ← CRUD + upload fichier
│   │   │   ├── UserController.php       ← Mon Espace + bio
│   │   │   └── AdminController.php      ← stats + gestion utilisateurs
│   │   └── Middleware/
│   │       └── CheckRole.php            ← Protection par rôle
│   └── Models/
│       ├── User.php
│       ├── Conference.php               ← toArray() : heureDebut, heureFin, speakerId...
│       ├── Stand.php                    ← toArray() : disponible, entrepriseId...
│       └── Programme.php               ← toArray() : dateMAJ, fichier...
├── bootstrap/
│   ├── app.php                          ← Configuration Laravel 11
│   └── providers.php
├── config/
│   ├── cors.php                         ← Origines React autorisées
│   ├── sanctum.php                      ← Auth token
│   ├── database.php
│   └── ...
├── database/
│   ├── migrations/                      ← 6 fichiers de migration
│   └── seeders/
│       └── DatabaseSeeder.php           ← Données identiques aux mocks frontend
├── routes/
│   └── api.php                          ← Toutes les routes
├── storage/                             ← Fichiers uploadés (programme PDF, etc.)
├── .env.example
└── composer.json
```

---

## Connexion avec le frontend React

### 1. Installer axios dans le projet frontend

```bash
npm install axios
```

### 2. Créer `src/api/axios.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// Injecter le token automatiquement
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('salon_user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Rediriger vers /login si le token expire
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('salon_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

### 3. Remplacer le AuthContext (mock → API)

```jsx
import api from '../api/axios';

// login : POST /api/login → { token, user: { id, nom, email, role } }
const login = async (email, password) => {
  const { data } = await api.post('/login', { email, password });
  const userData = { ...data.user, token: data.token };
  localStorage.setItem('salon_user', JSON.stringify(userData));
  setUser(userData);
  return userData;
};

// register : POST /api/register
const register = async (nom, email, password, role) => {
  await api.post('/register', { nom, email, password, role });
  return true;
};

// logout : POST /api/logout
const logout = async () => {
  try { await api.post('/logout'); } catch {}
  localStorage.removeItem('salon_user');
  setUser(null);
};
```

### 4. Remplacer les appels mock dans chaque page

**Conferences.jsx**
```js
// Charger
const { data } = await api.get('/conferences');
setConferences(data.conferences);
setInscriptions(data.inscriptions);

// Inscrire
await api.post(`/conferences/${id}/inscrire`);
// Désinscrire
await api.delete(`/conferences/${id}/inscrire`);
// Ajouter (admin)
const { data } = await api.post('/conferences', payload);
// Modifier (admin)
const { data } = await api.put(`/conferences/${id}`, payload);
// Supprimer (admin)
await api.delete(`/conferences/${id}`);
```

**Stands.jsx**
```js
const { data } = await api.get('/stands');          // charger
await api.post(`/stands/${id}/reserver`);           // réserver
await api.delete(`/stands/${id}/reserver`);         // libérer
await api.post('/stands', form);                    // ajouter (admin)
await api.put(`/stands/${id}`, form);               // modifier (admin)
await api.delete(`/stands/${id}`);                  // supprimer (admin)
```

**Programme.jsx**
```js
const { data } = await api.get('/programme');       // charger
await api.put('/programme', { titre, contenu });    // modifier (admin)

// Upload fichier (admin)
const formData = new FormData();
formData.append('fichier', file);
await api.post('/programme/fichier', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
await api.delete('/programme/fichier');             // supprimer fichier (admin)
```

**MonEspace.jsx**
```js
const { data } = await api.get('/mon-espace');      // charger tout
await api.delete(`/conferences/${id}/inscrire`);    // désinscrire (étudiant)
await api.delete(`/stands/${id}/reserver`);         // libérer stand (entreprise)
await api.put('/mon-espace/bio', { bio });          // sauvegarder bio (conférencier)
```

**AdminPanel.jsx**
```js
await api.get('/admin/stats');                      // stats
await api.get('/admin/users');                      // liste utilisateurs
await api.delete(`/admin/users/${id}`);             // supprimer utilisateur
```

---

## Correspondance variables frontend ↔ backend

| Frontend (reçu/envoyé) | Base de données | Notes |
|---|---|---|
| `heureDebut` | `heure_debut` | Converti dans `toArray()` |
| `heureFin` | `heure_fin` | Converti dans `toArray()` |
| `speakerId` | `speaker_id` | Converti dans `toArray()` |
| `maxParticipants` | `max_participants` | Converti dans `toArray()` |
| `entrepriseId` | `entreprise_id` | Converti dans `toArray()` |
| `disponible` | `disponible` | boolean |
| `dateMAJ` | `updated_at` | Formaté en français |
| `fichier.url` | `storage/fichier_path` | URL publique |
| `fichier.nom` | `fichier_nom` | Nom original |
| `fichier.type` | `fichier_type` | MIME type |
