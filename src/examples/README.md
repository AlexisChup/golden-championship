# 🧪 Dossier Examples

Ce dossier contient tous les exemples et tests pour démontrer l'utilisation des différentes fonctionnalités configurées dans le projet.

## 📁 Structure

```
examples/
├── index.ts                 # Point d'entrée pour tous les exemples
├── ApiTestExamples.tsx      # Exemples consolidés des tests API
├── ApiExamples.tsx          # Exemples avancés du hook useApiCall
└── PostForm.tsx            # Exemple de formulaire avec gestion d'état
```

## 🚀 Utilisation

### Import simple
```tsx
import { ApiTestExamples } from '../examples'
```

### Import spécifique
```tsx
import { ApiExamples, PostForm } from '../examples'
```

## 📋 Composants disponibles

### `ApiTestExamples`
Composant consolidé qui montre :
- Tests de notifications toast
- Appels API GET/POST
- Gestion d'erreurs
- États de chargement
- Interface compacte et claire

### `ApiExamples` 
Exemples avancés :
- Appels avec IDs dynamiques
- Appels silencieux
- Reset des données
- Gestion fine des états

### `PostForm`
Exemple de formulaire complet :
- Validation des champs
- Soumission avec useApiCall
- Gestion des erreurs de validation
- Interface utilisateur complète

## 🔧 Technologies démontrées

- ✅ **useApiCall** : Hook personnalisé pour les appels API
- ✅ **Axios** : Configuration avec intercepteurs
- ✅ **React Hot Toast** : Notifications utilisateur
- ✅ **TypeScript** : Types sécurisés
- ✅ **Tailwind CSS** : Styling moderne

## 💡 Note

Ces exemples sont prêts à être utilisés comme référence pour le développement de nouvelles fonctionnalités dans le projet principal.