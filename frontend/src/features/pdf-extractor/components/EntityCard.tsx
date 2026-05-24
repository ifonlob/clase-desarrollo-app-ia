import { Tag } from 'primereact/tag'
import type { ExtractedEntity, EntityType } from '@/shared/types/pdf.types'

interface Props {
  entity: ExtractedEntity
}

const ENTITY_META: Record<EntityType, { label: string; severity: 'info' | 'success' | 'warning' | 'danger' | null }> = {
  LOCATION: { label: 'Lugar', severity: 'info' },
  MONUMENT: { label: 'Monumento', severity: 'success' },
  PERSON: { label: 'Persona', severity: null },
  DATE: { label: 'Fecha', severity: 'warning' },
  ORGANIZATION: { label: 'Organización', severity: 'danger' },
  EVENT: { label: 'Evento', severity: null },
}

function confidenceColor(c: number) {
  if (c > 0.85) return 'text-green-600'
  if (c > 0.6) return 'text-amber-600'
  return 'text-red-600'
}

export default function EntityCard({ entity }: Props) {
  const meta = ENTITY_META[entity.type]

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Tag value={meta.label} severity={meta.severity} />
        <span className={`text-sm font-semibold ${confidenceColor(entity.confidence)}`}>
          {Math.round(entity.confidence * 100)}%
        </span>
      </div>

      <p className="font-bold text-gray-900 mb-1">{entity.value}</p>
      <p className="text-sm text-gray-500 line-clamp-2">{entity.context}</p>
      <p className="text-xs text-gray-400 mt-2">Pág. {entity.pageNumber}</p>
    </div>
  )
}
