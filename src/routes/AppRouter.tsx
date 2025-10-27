  import { Routes, Route } from "react-router-dom"

  // Pages publiques
  import Home from "../pages/Home"
  import About from "../pages/About"
  import Competitions from "../pages/Competitions"
  import Fighters from "../pages/Fighters"
  import Clubs from "../pages/Clubs"
  import News from "../pages/News"
  import Contact from "../pages/Contact"

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
        <Route path="/fighters" element={<Fighters />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        
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
