export type MessageRole = 'user' | 'assistant' | 'system'

export type ToolName = 'weather_search' | 'web_search' | 'travel_search' | 'faq_vector_search'

export interface ToolCall {
  toolName: ToolName
  input: string
  output: string
  durationMs: number
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  toolCalls: ToolCall[]
  timestamp: string
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: string
}

export interface SendMessageRequest {
  sessionId: string | null
  content: string
}

export interface SendMessageResponse {
  sessionId: string
  message: ChatMessage
}
