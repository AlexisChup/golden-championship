# 🚀 Guide de Démarrage Rapide

## ✅ Ce qui est déjà configuré

### 🎨 Interface & Navigation
- ✅ **Header** responsive avec navigation conditionnelle
- ✅ **Footer** générique avec liens légaux
- ✅ **Layout** global (Header + contenu + Footer)
- ✅ **10 pages** prêtes à être développées

### 🔐 Authentification
- ✅ Hook `useAuth` pour gérer la connexion
- ✅ Navigation qui s'adapte (connecté/déconnecté)
- ✅ Composant `ProtectedRoute` pour sécuriser les routes
- ⚠️ Auth actuellement en localStorage (à remplacer)

### 🌐 API & Gestion d'état
- ✅ Axios configuré avec intercepteurs
- ✅ Hook `useApiCall` pour simplifier les appels
- ✅ React Hot Toast pour les notifications
- ✅ Services API structurés

## 🧭 Routes disponibles

### Pages publiques
```
/                  → Home
/competitions      → Liste des compétitions
/fighters          → Annuaire des combattants
/clubs             → Annuaire des clubs
/news              → Actualités
/about             → À propos
/login             → Connexion
/register          → Inscription
/terms             → Conditions d'utilisation
/privacy           → Politique de confidentialité
```

### Pages protégées
```
/dashboard         → Tableau de bord (nécessite connexion)
```

## 💻 Utilisation

### Tester l'authentification
1. Aller sur `/login`
2. Entrer n'importe quel email/mot de passe
3. Cliquer sur "Se connecter"
4. Vous êtes redirigé vers `/dashboard`
5. Le header affiche maintenant "Dashboard" et "Déconnexion"

### Voir les exemples API
1. Aller sur la page d'accueil `/`
2. Cliquer sur "🔽 Voir les exemples de test"
3. Tester les boutons pour voir Axios et Toast en action

### Protéger une route
```tsx
import { ProtectedRoute } from '../components'

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Utiliser useAuth dans un composant
```tsx
import { useAuth } from '../hooks/useAuth'

const MyComponent = () => {
  const { isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Se déconnecter</button>
      ) : (
        <button onClick={login}>Se connecter</button>
      )}
    </div>
  )
}
```

### Faire un appel API
```tsx
import { useApiCall } from '../hooks/useApiCall'
import { postService } from '../api/services'

const MyComponent = () => {
  const postsApi = useApiCall<Post[]>()
  
  const fetchPosts = async () => {
    try {
      const posts = await postsApi.execute(
        () => postService.getAllPosts(),
        {
          successMessage: '✅ Posts récupérés !',
          showLoadingToast: true
        }
      )
      console.log(posts)
    } catch (error) {
      // Erreur gérée automatiquement
    }
  }
  
  return (
    <button 
      onClick={fetchPosts} 
      disabled={postsApi.loading}
    >
      {postsApi.loading ? 'Chargement...' : 'Charger les posts'}
    </button>
  )
}
```

## 📝 Prochaines étapes recommandées

1. **Implémenter une vraie API d'authentification**
   - Remplacer localStorage par des tokens JWT
   - Ajouter refresh tokens
   - Gérer les sessions

2. **Ajouter le contenu des pages**
   - Competitions : liste, filtres, détails
   - Fighters : profils, stats, recherche
   - Clubs : liste, inscriptions
   - Dashboard : selon le rôle utilisateur

3. **Gestion des rôles**
   - Différents types de dashboard
   - Permissions selon les rôles
   - Routes spécifiques par rôle

4. **Store global avec Zustand**
   - État d'authentification global
   - Cache des données
   - Préférences utilisateur

## 🎯 Structure propre et prête

Tout est maintenant organisé, documenté et prêt pour le développement.
Les exemples sont isolés dans `/examples` et le code de production est clean ! 🚀