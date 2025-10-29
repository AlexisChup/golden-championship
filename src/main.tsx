import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { FightersProvider } from './contexts/FightersContext'
import { ClubsProvider } from './contexts/ClubsContext'
import { CompetitionsProvider } from './contexts/CompetitionsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FightersProvider>
        <ClubsProvider>
          <CompetitionsProvider>
            <App />
            <Toaster position="top-right" />
          </CompetitionsProvider>
        </ClubsProvider>
      </FightersProvider>
    </BrowserRouter>
  </StrictMode>,
)
