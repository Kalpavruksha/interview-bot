import { useQuery } from '@tanstack/react-query'
import indexedDBService from '../../services/indexedDBService'

export const useCandidate = (id) => {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => indexedDBService.getCandidateById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute
    cacheTime: 1000 * 60 * 5 // 5 minutes
  })
}