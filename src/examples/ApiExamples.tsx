import { useApiCall } from '../hooks/useApiCall'
import { postService, type Post, type User } from '../api/services'

// Exemple d'un composant qui utilise useApiCall de manière avancée
export const ApiExamples = () => {
  // Différentes instances du hook pour différents types de données
  const singlePostApi = useApiCall<Post>()
  const singleUserApi = useApiCall<User>()
  const allPostsApi = useApiCall<Post[]>()

  // Exemple 1: Récupération avec ID dynamique
  const handleGetSpecificPost = async (postId: number) => {
    try {
      await singlePostApi.execute(
        () => postService.getPostById(postId),
        {
          successMessage: `Post #${postId} récupéré !`,
          errorMessage: `Erreur lors de la récupération du post #${postId}`,
          showLoadingToast: true
        }
      )
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Exemple 2: Appel sans notification automatique
  const handleSilentCall = async () => {
    try {
      const posts = await allPostsApi.execute(
        () => postService.getAllPosts()
        // Pas d'options = pas de notifications automatiques
      )
      console.log(`${posts.length} posts récupérés silencieusement`)
    } catch (error) {
      console.error('Erreur silencieuse:', error)
    }
  }

  // Exemple 3: Reset des données
  const handleReset = () => {
    singlePostApi.reset()
    singleUserApi.reset()
    allPostsApi.reset()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-700">Exemples avancés useApiCall</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleGetSpecificPost(1)}
          disabled={singlePostApi.loading}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          {singlePostApi.loading ? 'Chargement...' : 'Récupérer Post #1'}
        </button>

        <button
          onClick={() => handleGetSpecificPost(42)}
          disabled={singlePostApi.loading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          {singlePostApi.loading ? 'Chargement...' : 'Récupérer Post #42'}
        </button>

        <button
          onClick={handleSilentCall}
          disabled={allPostsApi.loading}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          {allPostsApi.loading ? 'Chargement...' : 'Appel Silencieux'}
        </button>

        <button
          onClick={handleReset}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          🔄 Reset All Data
        </button>
      </div>

      {/* Affichage des données avec gestion d'erreur */}
      <div className="space-y-4">
        {singlePostApi.data && (
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800">Post récupéré:</h4>
            <p className="text-indigo-700">{singlePostApi.data.title}</p>
            <p className="text-indigo-600 text-sm">{singlePostApi.data.body}</p>
          </div>
        )}

        {singlePostApi.error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800">Erreur:</h4>
            <p className="text-red-600 text-sm">{singlePostApi.error.message}</p>
          </div>
        )}

        {allPostsApi.data && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800">
              Appel silencieux: {allPostsApi.data.length} posts récupérés
            </h4>
          </div>
        )}
      </div>

      {/* Indicateurs de status */}
      <div className="flex space-x-4 text-sm">
        <span className={`px-2 py-1 rounded ${singlePostApi.loading ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
          Single Post: {singlePostApi.loading ? 'Loading...' : 'Ready'}
        </span>
        <span className={`px-2 py-1 rounded ${allPostsApi.loading ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
          All Posts: {allPostsApi.loading ? 'Loading...' : 'Ready'}
        </span>
      </div>
    </div>
  )
}