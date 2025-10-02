import { useQuery } from '@tanstack/react-query'
import indexedDBService from '../../services/indexedDBService'

export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: () => indexedDBService.getCandidates(),
    staleTime: 1000 * 60 * 1, // 1 minute
    cacheTime: 1000 * 60 * 5 // 5 minutes
  })
}