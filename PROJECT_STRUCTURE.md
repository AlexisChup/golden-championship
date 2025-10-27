# 📁 Structure du Projet Golden Championship

## 🗂️ Organisation des dossiers

```
src/
├── pages/              # Toutes les pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── About.tsx       # À propos
│   ├── Competitions.tsx # Liste des compétitions
│   ├── Fighters.tsx    # Annuaire des combattants
│   ├── Clubs.tsx       # Annuaire des clubs
│   ├── News.tsx        # Actualités
│   ├── Dashboard.tsx   # Tableau de bord (protégé)
│   ├── Login.tsx       # Connexion
│   ├── Register.tsx    # Inscription
│   ├── Terms.tsx       # CGU
│   └── Privacy.tsx     # Politique de confidentialité
├── components/         # Composants réutilisables
│   ├── Header.tsx      # En-tête avec navigation conditionnelle
│   ├── Footer.tsx      # Pied de page
│   └── Layout.tsx      # Layout principal (Header + contenu + Footer)
├── hooks/              # Hooks personnalisés
│   ├── useApiCall.ts   # Gestion des appels API
│   └── useAuth.ts      # Gestion de l'authentification
├── api/                # Configuration API
│   ├── axios.ts        # Configuration Axios + intercepteurs
│   └── services.ts     # Services API
├── routes/             # Configuration des routes
│   └── AppRouter.tsx   # Toutes les routes de l'app
├── examples/           # Composants d'exemple (tests)
└── ...
```

## 🧭 Navigation

### Pages publiques (non connecté)
- **/** - Accueil
- **/competitions** - Compétitions
- **/fighters** - Combattants
- **/clubs** - Clubs
- **/news** - Actualités
- **/login** - Connexion
- **/register** - Inscription
- **/about** - À propos
- **/terms** - CGU
- **/privacy** - Politique de confidentialité

### Pages protégées (connecté)
- **/dashboard** - Tableau de bord personnalisé

## 🔐 Authentification

### Hook useAuth
```tsx
import { useAuth } from '../hooks/useAuth'

const { isAuthenticated, login, logout, loading } = useAuth()
```

**Note**: Actuellement, l'authentification utilise localStorage pour la démo. 
À remplacer par une vraie API plus tard.

### État stocké
- `localStorage.getItem('isAuthenticated')` - État de connexion

## 🎨 Composants principaux

### Header
- Navigation conditionnelle selon l'état de connexion
- Menu responsive (mobile + desktop)
- Boutons Login/Register ou Dashboard/Logout

### Footer
- Liens de navigation
- Liens légaux (Terms, Privacy)
- Réseaux sociaux (placeholders)
- Copyright

### Layout
- Structure globale : Header + Main + Footer
- Appliqué automatiquement à toutes les pages

## 🚀 Prochaines étapes

1. ✅ Structure de base créée
2. ✅ Authentification simulée
3. ⏳ Implémenter une vraie API d'authentification
4. ⏳ Ajouter les fonctionnalités métier (compétitions, combattants, etc.)
5. ⏳ Protection des routes (ProtectedRoute component)
6. ⏳ Gestion des rôles utilisateurs

## 📝 Notes de développement

- Toutes les pages sont des **placeholders** prêts à recevoir du contenu
- Le header s'adapte automatiquement à l'état de connexion
- Le footer est générique et facilement modifiable
- Les routes sont toutes configurées dans `AppRouter.tsx`
- Les exemples API sont dans le dossier `examples/` et masqués par défaut