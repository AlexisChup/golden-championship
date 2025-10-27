import api from './axios'

export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  website: string
}

// Service pour récupérer des posts
export const postService = {
  // Récupérer tous les posts
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts')
    return response.data
  },

  // Récupérer un post par ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${id}`)
    return response.data
  },

  // Créer un nouveau post
  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await api.post<Post>('/posts', post)
    return response.data
  }
}

// Service pour récupérer des utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }
}

// Service pour tester les erreurs
export const testService = {
  // Endpoint qui n'existe pas pour tester les erreurs 404
  testError404: async () => {
    const response = await api.get('/nonexistent-endpoint')
    return response.data
  },

  // Test d'erreur de réseau (timeout)
  testTimeout: async () => {
    const response = await api.get('/posts', { timeout: 1 }) // 1ms timeout
    return response.data
  }
}