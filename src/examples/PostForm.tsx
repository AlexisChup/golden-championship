import { useState } from 'react'
import { useApiCall } from '../hooks/useApiCall'
import { postService, type Post } from '../api/services'

export const PostForm = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userId, setUserId] = useState(1)

  // Hook pour la création de post avec gestion des états
  const createPostApi = useApiCall<Post>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !body.trim()) {
      // On peut aussi utiliser le hook pour afficher des erreurs de validation
      await createPostApi.execute(
        () => Promise.reject(new Error('Titre et contenu requis')),
        {
          errorMessage: '❌ Veuillez remplir tous les champs'
        }
      )
      return
    }

    try {
      const newPost = await createPostApi.execute(
        () => postService.createPost({ title, body, userId }),
        {
          successMessage: `✅ Post "${title}" créé avec succès !`,
          showLoadingToast: true
        }
      )

      // Reset du formulaire après succès
      setTitle('')
      setBody('')
      setUserId(1)
      
      console.log('Post créé:', newPost)
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    }
  }

  const handleReset = () => {
    setTitle('')
    setBody('')
    setUserId(1)
    createPostApi.reset()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        🚀 Exemple de formulaire avec useApiCall
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
            Titre du post
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le titre..."
            disabled={createPostApi.loading}
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-600 mb-1">
            Contenu
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le contenu..."
            disabled={createPostApi.loading}
          />
        </div>

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-600 mb-1">
            ID Utilisateur
          </label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createPostApi.loading}
          >
            {[1, 2, 3, 4, 5].map((id) => (
              <option key={id} value={id}>
                Utilisateur {id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={createPostApi.loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {createPostApi.loading ? '⏳ Création...' : '📝 Créer le Post'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={createPostApi.loading}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {/* Affichage du résultat */}
      {createPostApi.data && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800">✅ Post créé avec succès !</h4>
          <p className="text-green-700 text-sm">ID: {createPostApi.data.id}</p>
          <p className="text-green-600 text-sm">Titre: {createPostApi.data.title}</p>
        </div>
      )}

      {/* Affichage des erreurs */}
      {createPostApi.error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-800">❌ Erreur</h4>
          <p className="text-red-600 text-sm">{createPostApi.error.message}</p>
        </div>
      )}

      {/* Informations de debug */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <strong>Status:</strong> {createPostApi.loading ? 'Loading' : 'Ready'} | 
        <strong> Data:</strong> {createPostApi.data ? 'Present' : 'None'} | 
        <strong> Error:</strong> {createPostApi.error ? 'Present' : 'None'}
      </div>
    </div>
  )
}