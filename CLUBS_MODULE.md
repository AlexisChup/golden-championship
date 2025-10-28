# Module Clubs - Documentation Complète

## 📁 Structure du Module

```
src/
├── pages/
│   └── Clubs/
│       ├── ClubsList.tsx          → Liste de tous les clubs avec filtres
│       ├── ClubDetail.tsx         → Page détaillée d'un club
│       └── ClubEditForm.tsx       → Formulaire d'édition/création
├── components/
│   └── clubs/
│       ├── ClubCard.tsx           → Carte de club pour la liste
│       ├── ClubForm.tsx           → Formulaire réutilisable
│       ├── ClubFightersList.tsx   → Liste des fighters affiliés
│       └── ClubInfoBlock.tsx      → Bloc d'informations du club
├── contexts/
│   └── ClubsContext.tsx           → Gestion du state global
├── data/
│   └── clubsData.ts               → Données mockées (5 clubs)
└── types/
    └── Club.ts                    → Types TypeScript
```

## ✨ Fonctionnalités Implémentées

### 1. **Liste des Clubs** (`/clubs`)
- **Grille responsive** : 3 colonnes sur desktop, 1 sur mobile
- **Statistiques globales** :
  - Total de clubs
  - Total de fighters (tous clubs confondus)
  - Nombre de villes
- **Filtres et recherche** :
  - Recherche par nom ou ville
  - Filtre par ville
  - Tri par nom, ville, ou nombre de fighters
- **Cartes de clubs** affichant :
  - Logo (placeholder avec initiale)
  - Nom du club
  - Ville avec icône
  - Discipline principale avec emoji
  - Nombre de fighters affiliés
  - Nombre de disciplines
- **Bouton "Add New Club"** pour créer un nouveau club

### 2. **Page de Détail** (`/clubs/:id`)
- **Header avec logo** et informations principales
- **Boutons d'action** : Edit et Delete
- **ClubInfoBlock** :
  - Informations complètes (nom, ville, adresse)
  - Description du club
  - Disciplines avec emojis et couleurs
  - Compteur de fighters
- **ClubFightersList** :
  - Liste complète des fighters affiliés au club
  - Filtrés automatiquement par `clubId`
  - Chaque fighter cliquable → redirection vers `/fighters/:id`
  - Affichage : nom, surnom, discipline, âge, catégorie, record

### 3. **Formulaire d'Édition** (`/clubs/:id/edit` ou `/clubs/new`)
- **Sections organisées** :
  - Informations de base (nom, ville, adresse, logo)
  - Description (textarea)
  - Disciplines offertes (multi-select avec boutons)
- **Validation** : au moins une discipline requise
- **Toasts** de confirmation (ajout/modification)
- **Redirection** automatique après sauvegarde

### 4. **Relation avec le Module Fighters**
- **Champ `clubId`** ajouté à l'interface `Fighter`
- **Select dynamique** dans `FighterForm` :
  - Liste tous les clubs disponibles
  - Affiche "Nom du club - Ville"
  - Met à jour automatiquement le nom et l'ID du club
- **Synchronisation automatique** :
  - Les fighters affiliés apparaissent dans la page du club
  - Filtrage par `clubId` au lieu du nom

## 🎨 Design & UI

### Couleurs des Disciplines
- **K1** : Bleu (`blue`)
- **Kickboxing** : Violet (`purple`)
- **Muay Thai** : Rouge (`red`)
- **MMA** : Vert (`green`)
- **Boxing** : Orange (`orange`)

### Emojis par Discipline
- **K1** : 🥊
- **Kickboxing** : 🥊
- **Muay Thai** : 🥋
- **MMA** : 🤼
- **Boxing** : 🥊

### Composants Visuels
- **Cards** avec hover effet (shadow-xl)
- **Gradients** : `bg-linear-to-r from-blue-500 to-purple-600`
- **Icônes SVG** : Location, Building, Users
- **Badges** : Disciplines avec couleurs dynamiques
- **Responsive** : Mobile-first avec breakpoints `md:` et `lg:`

## 📊 Données Mockées

### Clubs Disponibles
1. **Scorpions Iași** (ID: 1)
   - Disciplines : K1, MMA
   - Fighters : Adelin Bucătaru, Cristian Dumitrescu

2. **Grizzly Gym** (ID: 2)
   - Disciplines : Kickboxing
   - Fighters : Andrei Georgescu

3. **Bucharest Fight Academy** (ID: 3)
   - Disciplines : MMA, Muay Thai
   - Fighters : Mihai Popescu, Alexandru Ionescu

4. **Iron Fist Boxing Club** (ID: 4)
   - Disciplines : Boxing
   - Fighters : Vlad Marinescu

5. **Warriors Gym Timișoara** (ID: 5)
   - Disciplines : K1, Kickboxing, MMA
   - Fighters : Aucun (pour tester l'affichage vide)

## 🔧 State Management

### ClubsContext
```typescript
interface ClubsContextType {
  clubs: Club[]
  getClubById: (id: number) => Club | undefined
  addClub: (club: Omit<Club, 'id' | 'fighters'>) => void
  updateClub: (id: number, club: Omit<Club, 'id' | 'fighters'>) => void
  deleteClub: (id: number) => void
  getClubFighters: (clubId: number) => number[]
  syncClubFighters: (clubId: number, fighterIds: number[]) => void
}
```

### Persistance
- **localStorage** : `clubs_data`
- Synchronisation automatique à chaque modification
- Fallback sur `initialClubsData` si erreur

## 🚀 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/clubs` | `ClubsList` | Liste de tous les clubs |
| `/clubs/:id` | `ClubDetail` | Détail d'un club |
| `/clubs/:id/edit` | `ClubEditForm` | Édition d'un club |
| `/clubs/new` | `ClubEditForm` | Création d'un club |

## 🔗 Intégration avec Fighters

### Dans FighterForm
```typescript
// Select dynamique des clubs
<select name="clubId" value={formData.clubId}>
  {clubs.map(club => (
    <option key={club.id} value={club.id}>
      {club.name} - {club.city}
    </option>
  ))}
</select>
```

### Dans ClubFightersList
```typescript
// Filtrage par clubId
const filteredFighters = fighters.filter(f => f.clubId === clubId)
```

## ✅ Fonctionnalités Avancées

### Compteurs Globaux
- **Total clubs** : Compteur en temps réel
- **Total fighters** : Calculé via `fighters.length`
- **Total villes** : Extrait via `getUniqueCities()`

### Tri Dynamique
- **Par nom** : Ordre alphabétique (A-Z)
- **Par ville** : Ordre alphabétique des villes
- **Par fighters** : Du plus grand au plus petit nombre

### Recherche Intelligente
- Recherche dans le nom du club
- Recherche dans la ville
- Insensible à la casse

## 🎯 Prochaines Étapes (Optionnelles)

1. **Upload de logos réels** : Intégration avec un service de stockage
2. **Gestion des permissions** : Seul le club peut modifier ses informations
3. **Statistiques avancées** : Palmarès global du club, taux de victoire
4. **Géolocalisation** : Carte interactive des clubs
5. **Calendrier** : Événements et entraînements du club
6. **Galerie photos** : Images du club et des entraînements

## 📝 Notes Techniques

- **TypeScript strict** : Tous les types sont correctement définis
- **React Context API** : Pas de prop drilling
- **Hooks personnalisés** : `useClubs()` pour accéder au contexte
- **Validation formulaire** : HTML5 native + vérifications custom
- **Responsive design** : Mobile-first avec Tailwind
- **Optimisation** : `useMemo` pour les calculs coûteux
- **Accessibilité** : Labels corrects, navigation au clavier

---

**Module créé le** : Octobre 2025  
**Version** : 1.0.0  
**Status** : ✅ Production Ready
