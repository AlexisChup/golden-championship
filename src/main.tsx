import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { FightersProvider } from './contexts/FightersContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FightersProvider>
        <App />
        <Toaster position="top-right" />
      </FightersProvider>
    </BrowserRouter>
  </StrictMode>,
)
