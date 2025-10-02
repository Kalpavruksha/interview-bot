import { useQuery } from '@tanstack/react-query'
import indexedDBService from '../../services/indexedDBService'

export const useQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      // For now, we'll return an empty array since questions are generated locally
      // In a more complex implementation, we might store questions in IndexedDB
      return []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // 10 minutes
  })
}