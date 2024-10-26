export const useChatState = () => useState<any>('chatState', () => ({
  chat: [],
  isLoading: false,
  error: null,
}))


// Funzione per fetchare le chat
export const fetchChats = async () => {
  const chatState = useChatState()

  // Imposta lo stato di caricamento
  chatState.value.isLoading = true

  try {
    // Effettua la richiesta e salva i dati delle chat
    const data = await $fetch('/api/chat')
    if (data.body && 'chat' in data.body && data.body.chat) {
      chatState.value.chat = data.body.chat || []
    }
  } catch (error) {
    chatState.value.error = error as string
  } finally {
    // Imposta lo stato di caricamento a false
    chatState.value.isLoading = false
  }
}