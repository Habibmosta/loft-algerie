# 🏢 Loft Algérie - Système de Gestion Immobilière

Une application web complète pour la gestion de propriétés immobilières en Algérie, développée avec Next.js 15 et Supabase.

## ✨ Fonctionnalités

### 🏠 Gestion des Lofts
- ✅ Création, modification et suppression de lofts
- ✅ Gestion des photos avec galerie intégrée
- ✅ Suivi des statuts (Disponible, Occupé, Maintenance)
- ✅ Calcul automatique des revenus
- ✅ Filtrage avancé par statut, propriétaire et zone

### 💰 Gestion Financière
- ✅ Suivi des transactions (revenus/dépenses)
- ✅ Gestion des factures automatisées
- ✅ Rapports financiers détaillés
- ✅ Support multi-devises (DZD, EUR, USD)
- ✅ Alertes de paiement

### 👥 Gestion des Utilisateurs
- ✅ Système d'authentification sécurisé
- ✅ Rôles et permissions (Admin, Manager, Viewer)
- ✅ Gestion des propriétaires
- ✅ Équipes et assignations

### 💬 Communication
- ✅ Système de conversations intégré
- ✅ Notifications en temps réel
- ✅ Gestion des tâches et assignations

### 🌍 Multilingue
- ✅ Support complet pour 3 langues :
  - 🇫🇷 Français
  - 🇺🇸 English  
  - 🇩🇿 العربية (Arabe)
- ✅ Interface adaptée RTL pour l'arabe
- ✅ Traductions dynamiques des contenus

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI modernes
- **React Hook Form** - Gestion des formulaires
- **React i18next** - Internationalisation

### Backend
- **Supabase** - Base de données PostgreSQL et authentification
- **Row Level Security (RLS)** - Sécurité au niveau des données
- **Real-time subscriptions** - Mises à jour en temps réel

### Outils de Développement
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **Husky** - Git hooks
- **TypeScript** - Vérification de types

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/loft-algerie.git
cd loft-algerie
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

### 4. Configuration de la base de données
```bash
# Exécuter les migrations SQL dans Supabase
# Fichiers disponibles dans /sql-backup/
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
loft-algerie/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Tableau de bord
│   ├── lofts/            # Gestion des lofts
│   ├── transactions/     # Gestion financière
│   ├── conversations/    # Messagerie
│   └── settings/         # Configuration
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base
│   ├── forms/           # Formulaires
│   └── lofts/           # Composants spécifiques aux lofts
├── lib/                 # Utilitaires et configuration
│   ├── auth/           # Authentification
│   ├── i18n/           # Internationalisation
│   └── types/          # Types TypeScript
├── public/             # Fichiers statiques
│   └── locales/        # Fichiers de traduction
├── utils/              # Utilitaires Supabase
└── sql-backup/         # Scripts SQL
```

## 🌐 Internationalisation

Le projet supporte 3 langues avec traductions complètes :

### Langues supportées
- **Français** (par défaut) - Interface complète
- **English** - Interface complète  
- **العربية** - Interface complète avec support RTL

### Ajout de nouvelles traductions
1. Ajouter les clés dans `/public/locales/[lang]/[namespace].json`
2. Utiliser `t('namespace:key')` dans les composants
3. Tester avec le sélecteur de langue

## 🔐 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Authentification JWT** avec Supabase Auth
- **Validation côté serveur** pour tous les formulaires
- **Sanitisation des données** utilisateur
- **HTTPS** obligatoire en production

## 📊 Fonctionnalités Avancées

### Rapports et Analytics
- Génération de rapports PDF
- Graphiques de performance
- Suivi des tendances financières
- Export de données

### Notifications
- Alertes de factures en retard
- Notifications de nouvelles réservations
- Rappels de maintenance
- Système de messagerie temps réel

### Gestion des Médias
- Upload d'images optimisé
- Galeries photos pour chaque loft
- Compression automatique
- Support multi-formats

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Variables d'environnement de production
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

## 🎯 Roadmap

### Version 2.0
- [ ] Application mobile (React Native)
- [ ] API REST publique
- [ ] Intégration avec services externes
- [ ] Module de comptabilité avancée
- [ ] Système de réservation en ligne

### Version 1.5
- [ ] Amélioration des performances
- [ ] Tests automatisés
- [ ] Documentation API
- [ ] Mode hors ligne

---

**Développé avec ❤️ pour la gestion immobilière en Algérie**