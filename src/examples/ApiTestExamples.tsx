import { useState } from 'react'
import toast from 'react-hot-toast'
import { postService, userService, testService, type Post, type User } from '../api/services'
import { useApiCall } from '../hooks/useApiCall'

/**
 * Composant d'exemples pour démontrer l'utilisation du hook useApiCall
 * et de la configuration Axios avec react-hot-toast
 */
export const ApiTestExamples = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  
  // Utilisation du hook useApiCall pour différents types d'appels
  const postsApi = useApiCall<Post[]>()
  const usersApi = useApiCall<User[]>()
  const createPostApi = useApiCall<Post>()
  const errorTestApi = useApiCall()

  // Tests de base
  const handleGetPosts = async () => {
    try {
      const data = await postsApi.execute(
        () => postService.getAllPosts(),
        {
          successMessage: '✅ Posts récupérés avec succès !',
          showLoadingToast: true
        }
      )
      setPosts(data.slice(0, 3))
    } catch (error) {
      console.error('Erreur posts:', error)
    }
  }

  const handleGetUsers = async () => {
    try {
      const data = await usersApi.execute(
        () => userService.getAllUsers(),
        {
          successMessage: '✅ Utilisateurs récupérés !',
          showLoadingToast: true
        }
      )
      setUsers(data.slice(0, 2))
    } catch (error) {
      console.error('Erreur utilisateurs:', error)
    }
  }

  const handleCreatePost = async () => {
    try {
      await createPostApi.execute(
        () => postService.createPost({
          title: 'Test Post',
          body: 'Contenu de test depuis useApiCall',
          userId: 1
        }),
        {
          successMessage: '✅ Post créé avec succès !',
          showLoadingToast: true
        }
      )
    } catch (error) {
      console.error('Erreur création:', error)
    }
  }

  const handleTestError = async () => {
    try {
      await errorTestApi.execute(
        () => testService.testError404(),
        {
          errorMessage: '❌ Test d\'erreur 404 !',
          showLoadingToast: true
        }
      )
    } catch (error) {
      console.log('Test d\'erreur effectué')
    }
  }

  const handleTestToast = () => {
    toast.success('🎉 Toast simple réussi !')
  }

  const handleReset = () => {
    setPosts([])
    setUsers([])
    postsApi.reset()
    usersApi.reset()
    createPostApi.reset()
    errorTestApi.reset()
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">🧪 Tests API & Notifications</h2>
        <p className="text-blue-700 text-sm">
          Exemples d'utilisation du hook useApiCall avec axios et react-hot-toast
        </p>
      </div>

      {/* Boutons de test */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Tests de base</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={handleTestToast}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            🎉 Toast Simple
          </button>
          
          <button
            onClick={handleGetPosts}
            disabled={postsApi.loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            {postsApi.loading ? '⏳' : '📄'} Posts
          </button>
          
          <button
            onClick={handleGetUsers}
            disabled={usersApi.loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            {usersApi.loading ? '⏳' : '👥'} Users
          </button>
          
          <button
            onClick={handleCreatePost}
            disabled={createPostApi.loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            {createPostApi.loading ? '⏳' : '✏️'} Créer
          </button>
          
          <button
            onClick={handleTestError}
            disabled={errorTestApi.loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            {errorTestApi.loading ? '⏳' : '❌'} Erreur
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Résultats compacts */}
      <div className="grid md:grid-cols-2 gap-4">
        {posts.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Posts ({posts.length})</h4>
            {posts.map((post) => (
              <div key={post.id} className="text-sm text-gray-600 mb-1">
                • {post.title.substring(0, 40)}...
              </div>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">Users ({users.length})</h4>
            {users.map((user) => (
              <div key={user.id} className="text-sm text-gray-600 mb-1">
                • {user.name} (@{user.username})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status des hooks */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-xs text-gray-600 space-x-4">
          <span>Posts: {postsApi.loading ? '🔄' : postsApi.data ? '✅' : '⭕'}</span>
          <span>Users: {usersApi.loading ? '🔄' : usersApi.data ? '✅' : '⭕'}</span>
          <span>Create: {createPostApi.loading ? '🔄' : createPostApi.data ? '✅' : '⭕'}</span>
          <span>Error: {errorTestApi.loading ? '🔄' : errorTestApi.error ? '❌' : '⭕'}</span>
        </div>
      </div>
    </div>
  )
}