import { useMutation } from '@tanstack/react-query'
import indexedDBService from '../../services/indexedDBService'
import { parseResume } from '../../utils/resumeParser'

export const useUploadResume = () => {
  return useMutation({
    mutationFn: async (file) => {
      // Parse resume locally instead of calling backend API
      const parsedData = await parseResume(file)
      
      // Save candidate to IndexedDB
      const candidateId = await indexedDBService.addCandidate({
        ...parsedData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      })
      
      return {
        ...parsedData,
        id: candidateId
      }
    },
    onSuccess: (data) => {
      // Handle success
      console.log('Resume processed and saved successfully:', data)
    },
    onError: (error) => {
      // Handle error
      console.error('Error processing resume:', error)
    }
  })
}