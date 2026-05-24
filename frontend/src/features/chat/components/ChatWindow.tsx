import { useEffect, useRef, KeyboardEvent } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { useChat } from '../hooks/useChat'
import MessageBubble from './MessageBubble'

export default function ChatWindow() {
  const { messages, isStreaming, error, inputValue, setInputValue, send } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  function handleSubmit() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    send(trimmed)
    setInputValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
            <i className="pi pi-comments text-5xl opacity-30" />
            <p className="text-lg">Empieza una conversación</p>
            <p className="text-sm">Pregunta sobre destinos, clima, vuelos o monumentos turísticos.</p>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse delay-75">●</span>
            <span className="animate-pulse delay-150">●</span>
            <span className="ml-1">Escribiendo…</span>
          </div>
        )}

        {error && (
          <Message severity="error" text={`Error: ${error}`} className="w-full" />
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <InputText
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta de viaje…"
          className="flex-1"
          disabled={isStreaming}
        />
        <Button
          icon="pi pi-send"
          onClick={handleSubmit}
          disabled={isStreaming || !inputValue.trim()}
          loading={isStreaming}
          aria-label="Enviar mensaje"
        />
      </div>
    </div>
  )
}
