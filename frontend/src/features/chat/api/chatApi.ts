import type { ChatMessage, MessageRole, ToolName, SendMessageRequest, SendMessageResponse, ChatSession } from '@/shared/types/chat.types'

function mapMessage(raw: Record<string, unknown>): ChatMessage {
  return {
    id: raw.id as string,
    role: raw.role as MessageRole,
    content: raw.content as string,
    toolCalls: ((raw.tool_calls as Array<Record<string, unknown>>) ?? []).map(tc => ({
      toolName: tc.tool_name as ToolName,
      input: tc.input as string,
      output: tc.output as string,
      durationMs: tc.duration_ms as number,
    })),
    timestamp: raw.created_at as string,
  }
}

export async function sendMessage(req: SendMessageRequest): Promise<SendMessageResponse> {
  const res = await fetch('/api/v1/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: req.sessionId, content: req.content }),
  })

  if (!res.ok) throw new Error(`Chat error: ${res.statusText}`)

  const data = await res.json()
  return {
    sessionId: data.session_id as string,
    message: mapMessage(data.message as Record<string, unknown>),
  }
}

export async function fetchSession(sessionId: string): Promise<ChatSession> {
  const res = await fetch(`/api/v1/chat/sessions/${sessionId}`)
  if (!res.ok) throw new Error(`Session error: ${res.statusText}`)
  const data = await res.json()
  return {
    id: data.id as string,
    messages: (data.messages as Array<Record<string, unknown>>).map(mapMessage),
    createdAt: data.created_at as string,
  }
}
