import { useMutation } from '@tanstack/react-query'
import indexedDBService from '../../services/indexedDBService'

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: async (answerData) => {
      // Save answer to IndexedDB instead of calling backend API
      const answerId = await indexedDBService.addAnswer(answerData)
      return {
        ...answerData,
        id: answerId
      }
    },
    onSuccess: (data) => {
      // Handle success
      console.log('Answer saved successfully:', data)
    },
    onError: (error) => {
      // Handle error
      console.error('Error saving answer:', error)
    }
  })
}