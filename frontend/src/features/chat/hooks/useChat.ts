import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { addMessage, setError, setSessionId, setStreaming } from '../store/chatSlice'
import { sendMessage } from '../api/chatApi'
import type { ChatMessage } from '@/shared/types/chat.types'

export function useChat() {
  const dispatch = useAppDispatch()
  const { messages, isStreaming, error, sessionId } = useAppSelector(s => s.chat)
  const [inputValue, setInputValue] = useState('')

  const mutation = useMutation({
    mutationFn: sendMessage,
    onMutate: ({ content }) => {
      dispatch(setStreaming(true))
      dispatch(setError(null))
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        toolCalls: [],
        timestamp: new Date().toISOString(),
      }
      dispatch(addMessage(userMsg))
    },
    onSuccess: data => {
      dispatch(setSessionId(data.sessionId))
      dispatch(addMessage(data.message))
    },
    onError: (err: Error) => {
      dispatch(setError(err.message))
    },
    onSettled: () => {
      dispatch(setStreaming(false))
    },
  })

  function send(content: string) {
    if (!content.trim() || isStreaming) return
    mutation.mutate({ sessionId, content })
  }

  return { messages, isStreaming, error, inputValue, setInputValue, send }
}
