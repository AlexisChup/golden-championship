  import { Routes, Route } from "react-router-dom"

  // Pages publiques
  import Home from "../pages/Home"
  import About from "../pages/About"
  import Competitions from "../pages/Competitions"
  import Clubs from "../pages/Clubs"
  import News from "../pages/News"
  import Contact from "../pages/Contact"

  // Pages Fighters
  import FightersList from "../pages/Fighters/FightersList"
  import FighterDetail from "../pages/Fighters/FighterDetail"
  import FighterEditForm from "../pages/Fighters/FighterEditForm"

  // Pages d'authentification
  import Login from "../pages/Login"
  import Register from "../pages/Register"

  // Pages protégées
  import Dashboard from "../pages/Dashboard"

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
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Fighters routes */}
        <Route path="/fighters" element={<FightersList />} />
        <Route path="/fighters/:id" element={<FighterDetail />} />
        <Route path="/fighters/:id/edit" element={<FighterEditForm />} />
        
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Pages protégées (Dashboard) */}
            <Route path="/dashboard"   element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Pages légales */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Page 404 - à ajouter plus tard si besoin */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    )
  }
