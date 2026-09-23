import { createContext, useContext } from 'react'

export const ConversationContext = createContext({
  id: null,
  title: '',
})

export function useConversation() {
  return useContext(ConversationContext)
}
