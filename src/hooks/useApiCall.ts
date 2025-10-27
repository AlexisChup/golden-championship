import { useState } from 'react'
import toast from 'react-hot-toast'

interface UseApiCallOptions {
  successMessage?: string
  errorMessage?: string
  showLoadingToast?: boolean
}

export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = async (
    apiCall: () => Promise<T>,
    options: UseApiCallOptions = {}
  ) => {
    const {
      successMessage,
      errorMessage,
      showLoadingToast = false
    } = options

    setLoading(true)
    setError(null)
    
    let loadingToastId: string | undefined

    if (showLoadingToast) {
      loadingToastId = toast.loading('Chargement en cours...')
    }

    try {
      const result = await apiCall()
      setData(result)

      if (loadingToastId) {
        toast.success(successMessage || 'Opération réussie !', {
          id: loadingToastId
        })
      } else if (successMessage) {
        toast.success(successMessage)
      }

      return result
    } catch (err) {
      const error = err as Error
      setError(error)

      if (loadingToastId) {
        toast.error(errorMessage || 'Une erreur s\'est produite', {
          id: loadingToastId
        })
      } else if (errorMessage) {
        toast.error(errorMessage)
      }

      throw error
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return {
    loading,
    data,
    error,
    execute,
    reset
  }
}