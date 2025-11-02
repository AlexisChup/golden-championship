import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { RepositoryProvider } from './contexts/RepositoryContext'

// Import global seed utilities for browser console access
import './data/globalUtils'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RepositoryProvider>
        <App />
        <Toaster position="top-right" />
      </RepositoryProvider>
    </BrowserRouter>
  </StrictMode>,
)
