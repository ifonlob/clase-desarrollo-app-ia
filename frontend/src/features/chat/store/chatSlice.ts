import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChatMessage } from '@/shared/types/chat.types'

interface ChatState {
  sessionId: string | null
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
}

const initialState: ChatState = {
  sessionId: null,
  messages: [],
  isStreaming: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload)
    },
    setStreaming(state, action: PayloadAction<boolean>) {
      state.isStreaming = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearChat(state) {
      state.sessionId = null
      state.messages = []
      state.isStreaming = false
      state.error = null
    },
  },
})

export const { setSessionId, addMessage, setStreaming, setError, clearChat } = chatSlice.actions
export default chatSlice.reducer
