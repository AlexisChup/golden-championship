import axios from 'axios'
import toast from 'react-hot-toast'

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // API publique pour les tests
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter des headers d'authentification ici
    console.log('Requête envoyée:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Erreur de requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('Erreur de réponse:', error)
    
    // Gestion globale des erreurs
    if (error.response) {
      // Erreur du serveur (4xx, 5xx)
      const message = error.response.data?.message || `Erreur ${error.response.status}`
      toast.error(message)
    } else if (error.request) {
      // Erreur réseau
      toast.error('Erreur de connexion réseau')
    } else {
      // Autre erreur
      toast.error('Une erreur inattendue s\'est produite')
    }
    
    return Promise.reject(error)
  }
)

export default api