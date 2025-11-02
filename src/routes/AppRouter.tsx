  import { Routes, Route, Navigate } from "react-router-dom"

  // Pages publiques
  import Home from "../pages/Home"
  import About from "../pages/About"
  import News from "../pages/News"
  import Contact from "../pages/Contact"

  // Pages Fighters
  import FightersList from "../pages/Fighters/FightersList"
  import FighterDetail from "../pages/Fighters/FighterDetail"
  import FighterEditForm from "../pages/Fighters/FighterEditForm"

  // Pages Clubs
  import ClubsList from "../pages/Clubs/ClubsList"
  import ClubDetail from "../pages/Clubs/ClubDetail"
  import ClubEditForm from "../pages/Clubs/ClubEditForm"

  // Pages Competitions
  import CompetitionsList from "../pages/Competitions/CompetitionsList"
  import CompetitionDetail from "../pages/Competitions/CompetitionDetail"
  import CompetitionGeneralInfo from "../pages/Competitions/CompetitionGeneralInfo"
  import CompetitionFightersTab from "../pages/Competitions/CompetitionFightersTab"
  import CompetitionMatchesTab from "../pages/Competitions/CompetitionMatchesTab"
  import CompetitionBracketTab from "../pages/Competitions/CompetitionBracketTab"
  import CompetitionEditForm from "../pages/Competitions/CompetitionEditForm"

  // Pages d'authentification
  import Login from "../pages/Login"
  import Register from "../pages/Register"

  // Pages protégées
  import Dashboard from "../pages/Dashboard"
  
  // Admin pages
  import DataManagement from "../pages/Admin/DataManagement"

  // Pages légales
  import Terms from "../pages/Terms"
  import Privacy from "../pages/Privacy"
  import { ProtectedRoute } from "../components"

  export const AppRouter = () => {
    return (
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Fighters routes */}
        <Route path="/fighters" element={<FightersList />} />
        <Route path="/fighters/new" element={<FighterEditForm />} />
        <Route path="/fighters/:id" element={<FighterDetail />} />
        <Route path="/fighters/:id/edit" element={<FighterEditForm />} />
        
        {/* Clubs routes */}
        <Route path="/clubs" element={<ClubsList />} />
        <Route path="/clubs/new" element={<ClubEditForm />} />
        <Route path="/clubs/:id" element={<ClubDetail />} />
        <Route path="/clubs/:id/edit" element={<ClubEditForm />} />
        
        {/* Competitions routes */}
        <Route path="/competitions" element={<CompetitionsList />} />
        <Route path="/competitions/new" element={<CompetitionEditForm />} />
        <Route path="/competitions/:id" element={<CompetitionDetail />}>
          <Route index element={<Navigate to="general-info" replace />} />
          <Route path="general-info" element={<CompetitionGeneralInfo />} />
          <Route path="fighters" element={<CompetitionFightersTab />} />
          <Route path="matches" element={<CompetitionMatchesTab />} />
          <Route path="bracket" element={<CompetitionBracketTab />} />
        </Route>
        <Route path="/competitions/:id/edit" element={<CompetitionEditForm />} />
        
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Pages protégées (Dashboard) */}
            <Route path="/dashboard"   element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/data" element={<DataManagement />} />
        
        {/* Pages légales */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Page 404 - à ajouter plus tard si besoin */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    )
  }
