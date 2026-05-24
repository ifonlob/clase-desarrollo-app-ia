import { useState } from 'react'
import type { ToolCall, ToolName } from '@/shared/types/chat.types'

interface Props {
  toolCall: ToolCall
}

const TOOL_META: Record<ToolName, { label: string; colorClass: string }> = {
  weather_search: { label: '☁️ Tiempo', colorClass: 'bg-blue-50 border-blue-200 text-blue-700' },
  web_search: { label: '🔍 Web', colorClass: 'bg-gray-50 border-gray-200 text-gray-700' },
  travel_search: { label: '✈️ Viajes', colorClass: 'bg-green-50 border-green-200 text-green-700' },
  faq_vector_search: { label: '🏛️ FAQ', colorClass: 'bg-amber-50 border-amber-200 text-amber-700' },
}

export default function ToolCallBadge({ toolCall }: Props) {
  const [expanded, setExpanded] = useState(false)
  const meta = TOOL_META[toolCall.toolName as ToolName] ?? {
    label: toolCall.toolName,
    colorClass: 'bg-gray-50 border-gray-200 text-gray-700',
  }

  return (
    <div
      className={`border rounded-lg p-2 text-xs cursor-pointer select-none ${meta.colorClass}`}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{meta.label}</span>
        <span className="opacity-60">{toolCall.durationMs}ms</span>
        <i className={`pi ${expanded ? 'pi-chevron-up' : 'pi-chevron-down'} ml-auto`} />
      </div>

      {expanded && (
        <div className="mt-2 space-y-1 text-xs">
          <div>
            <span className="font-semibold">Input: </span>
            <span className="opacity-80">{toolCall.input}</span>
          </div>
          <div>
            <span className="font-semibold">Output: </span>
            <span className="opacity-80 break-all">{toolCall.output}</span>
          </div>
        </div>
      )}
    </div>
  )
}
