# 🏢 Loft Algérie - Système de Gestion Immobilière

> Système de gestion immobilière complet avec génération de rapports PDF professionnels pour optimiser vos opérations.

## 🌟 Fonctionnalités

### 🏠 **Gestion des Propriétés**
- Gestion complète des lofts et propriétés
- Suivi des propriétaires et zones géographiques
- Galerie photos et documentation

### 📅 **Réservations & Disponibilités**
- Système de réservation avancé
- Gestion des disponibilités en temps réel
- Calendrier interactif

### 💰 **Gestion Financière**
- Suivi des transactions et revenus
- Gestion des dépenses et factures
- Rapports financiers détaillés

### 👥 **Équipes & Tâches**
- Gestion des équipes et collaborateurs
- Attribution et suivi des tâches
- Notifications en temps réel

### 📊 **Rapports & Analytics**
- Génération de rapports PDF professionnels
- Dashboard avec statistiques avancées
- Analyses de performance

### 💬 **Communication**
- Système de conversations intégré
- Notifications push en temps réel
- Interface WhatsApp-like

## 🌍 **Multilingue**

L'application supporte 3 langues :
- 🇫🇷 **Français**
- 🇬🇧 **Anglais** 
- 🇸🇦 **Arabe**

## 🎨 **Interface Moderne**

- ✅ **100% Responsive** (Mobile, Tablette, Desktop)
- 🌙 **Mode Dark/Light** complet
- 🎯 **UX/UI optimisée**
- ⚡ **Performance élevée**

## 🛠️ **Technologies Utilisées**

### **Frontend**
- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **React i18next** - Internationalisation
- **Lucide React** - Icônes

### **Backend & Base de Données**
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de données
- **Real-time** - Synchronisation temps réel

### **Outils & Qualité**
- **ESLint** - Linting
- **Prettier** - Formatage de code
- **TypeScript** - Sécurité des types

## 🚀 **Installation**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### **1. Cloner le projet**
```bash
git clone https://github.com/votre-username/loft-algerie.git
cd loft-algerie
```

### **2. Installer les dépendances**
```bash
npm install
# ou
yarn install
```

### **3. Configuration**
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

### **4. Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 **Captures d'Écran**

### **Page d'Accueil**
- Interface moderne et responsive
- Navigation intuitive
- Support multilingue

### **Dashboard**
- Statistiques en temps réel
- Graphiques interactifs
- Alertes et notifications

### **Gestion des Lofts**
- Liste et détails des propriétés
- Galerie photos
- Informations complètes

## 🏗️ **Architecture**

```
loft-algerie/
├── app/                    # Pages Next.js 13+
├── components/             # Composants React réutilisables
├── lib/                    # Utilitaires et configurations
├── public/                 # Assets statiques
├── hooks/                  # Hooks personnalisés
├── utils/                  # Fonctions utilitaires
└── types/                  # Types TypeScript
```

## 🔧 **Scripts Disponibles**

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript
```

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 **Auteur**

**Votre Nom**
- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com

## 🙏 **Remerciements**

- [Next.js](https://nextjs.org/) pour le framework
- [Supabase](https://supabase.com/) pour le backend
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Lucide](https://lucide.dev/) pour les icônes

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a aidé !**