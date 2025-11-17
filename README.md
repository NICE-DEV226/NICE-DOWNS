# NICE-Downs 🇧🇫

**Téléchargeur de contenu multimédia universel développé au Burkina Faso**

NICE-Downs est une application web moderne qui permet de télécharger facilement du contenu depuis les principales plateformes de médias sociaux.

## ✨ Fonctionnalités

- 🎵 **TikTok** - Vidéos et audio
- 📸 **Instagram** - Photos, vidéos, stories et reels
- 📘 **Facebook** - Vidéos et photos
- 🐦 **X (Twitter)** - Vidéos et images
- 🔴 **Reddit** - Vidéos et GIFs
- 🎯 **Interface moderne** avec animations fluides
- 📱 **Design responsive** pour tous les appareils
- ⚡ **Téléchargement rapide** avec gestion d'erreurs
- 📊 **Dashboard admin** pour la gestion
- 🛡️ **Sécurisé** avec authentification et rate limiting

## 🚀 Technologies

### Frontend
- **React 19** avec Vite
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Zustand** pour la gestion d'état
- **Axios** pour les requêtes HTTP

### Backend
- **Node.js** avec Express
- **SQLite** pour la base de données
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Helmet** pour la sécurité

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/NICE-DEV226/NICE-DOWNS.git
cd NICE-DOWNS
```

2. **Installer les dépendances frontend**
```bash
npm install
```

3. **Installer les dépendances backend**
```bash
cd backend
npm install
cd ..
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

5. **Initialiser la base de données**
```bash
node backend/scripts/initDatabase.js
```

6. **Démarrer en mode développement**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run backend:dev
```

L'application sera disponible sur `http://localhost:5173`

## 🌐 Déploiement sur Vercel

### Déploiement automatique

1. **Fork ce repository**
2. **Connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Importer le projet depuis GitHub
   - Vercel détectera automatiquement la configuration

3. **Configurer les variables d'environnement**
   Dans le dashboard Vercel, ajouter :
   ```
   NODE_ENV=production
   JWT_SECRET=votre-secret-jwt-super-securise
   ADMIN_EMAIL=votre-email@example.com
   ADMIN_PASSWORD=VotreMotDePasseSecurise
   VITE_BACKEND_URL=https://votre-app.vercel.app
   ALLOWED_ORIGINS=https://votre-app.vercel.app
   ```

4. **Déployer**
   - Vercel déploiera automatiquement à chaque push

### Déploiement manuel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

## 🔧 Configuration

### Variables d'environnement

#### Frontend (.env)
```env
VITE_BACKEND_URL=https://votre-app.vercel.app
```

#### Backend
```env
NODE_ENV=production
JWT_SECRET=votre-secret-jwt-super-securise
ADMIN_EMAIL=admin@votre-domaine.com
ADMIN_PASSWORD=VotreMotDePasseSecurise
ALLOWED_ORIGINS=https://votre-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 👨‍💻 Administration

### Accès admin
- URL: `/admin`
- Email par défaut: `admin@nice-downs.com`
- Mot de passe par défaut: `NiceDowns2024!`

**⚠️ IMPORTANT: Changez les identifiants par défaut en production !**

### Fonctionnalités admin
- 📊 Statistiques d'utilisation
- 🐛 Gestion des rapports d'erreurs
- ⭐ Consultation des notations utilisateurs
- 👥 Gestion des utilisateurs
- ⚙️ Configuration système

## 🛡️ Sécurité

- **Rate limiting** pour prévenir les abus
- **CORS** configuré pour les domaines autorisés
- **Helmet** pour les headers de sécurité
- **JWT** pour l'authentification admin
- **bcryptjs** pour le hachage des mots de passe
- **Validation** des entrées utilisateur

## 📱 API

### Endpoints publics
- `POST /api/error-reports` - Signaler une erreur
- `POST /api/ratings` - Envoyer une notation

### Endpoints admin (authentification requise)
- `POST /api/auth/login` - Connexion admin
- `GET /api/error-reports` - Liste des rapports
- `GET /api/ratings` - Liste des notations
- `GET /api/stats` - Statistiques

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🇧🇫 Développé au Burkina Faso

Créé avec ❤️ par **NICE-DEV** au Burkina Faso

---

## 🆘 Support

Pour toute question ou problème :
- 📧 Email: support@nice-downs.com
- 🐛 Issues: [GitHub Issues](https://github.com/NICE-DEV226/NICE-DOWNS/issues)

## 🔄 Changelog

### v1.0.0 (2024)
- ✨ Version initiale
- 🎵 Support TikTok, Instagram, Facebook, X, Reddit
- 📱 Interface responsive
- 👨‍💻 Dashboard admin
- 🛡️ Système de sécurité complet