import { useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import type { ExtractedEntity, EntityType } from '@/shared/types/pdf.types'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { setEntityFilter } from '../store/pdfSlice'

const ENTITY_TYPES: Array<EntityType | 'ALL'> = ['ALL', 'LOCATION', 'MONUMENT', 'PERSON', 'DATE', 'ORGANIZATION', 'EVENT']
const TYPE_LABELS: Record<string, string> = {
  ALL: 'Todos', LOCATION: 'Lugar', MONUMENT: 'Monumento', PERSON: 'Persona',
  DATE: 'Fecha', ORGANIZATION: 'Organización', EVENT: 'Evento',
}

interface Props {
  entities: ExtractedEntity[]
}

export default function EntityTable({ entities }: Props) {
  const dispatch = useAppDispatch()
  const entityFilter = useAppSelector(s => s.pdf.entityFilter)
  const [globalFilter, setGlobalFilter] = useState('')
  const dtRef = useRef<DataTable<ExtractedEntity[]>>(null)

  const filtered = entities.filter(e =>
    (entityFilter === 'ALL' || e.type === entityFilter) &&
    (globalFilter === '' ||
      e.value.toLowerCase().includes(globalFilter.toLowerCase()) ||
      e.context.toLowerCase().includes(globalFilter.toLowerCase()))
  )

  const typeBody = (e: ExtractedEntity) => (
    <Tag value={TYPE_LABELS[e.type] ?? e.type} />
  )

  const confidenceBody = (e: ExtractedEntity) => {
    const pct = Math.round(e.confidence * 100)
    const color = e.confidence > 0.85 ? '#22c55e' : e.confidence > 0.6 ? '#f59e0b' : '#ef4444'
    return <span style={{ color, fontWeight: 600 }}>{pct}%</span>
  }

  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        <InputText
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Buscar…"
          className="flex-1"
        />
        <Dropdown
          value={entityFilter}
          options={ENTITY_TYPES.map(t => ({ label: TYPE_LABELS[t], value: t }))}
          onChange={e => dispatch(setEntityFilter(e.value))}
          className="w-44"
        />
        <Button
          icon="pi pi-download"
          label="CSV"
          outlined
          onClick={() => dtRef.current?.exportCSV()}
        />
      </div>

      <DataTable
        ref={dtRef}
        value={filtered}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        emptyMessage="No se encontraron entidades."
        size="small"
        exportFilename="entidades"
      >
        <Column field="type" header="Tipo" body={typeBody} sortable style={{ width: '130px' }} />
        <Column field="value" header="Valor" sortable />
        <Column field="pageNumber" header="Pág." sortable style={{ width: '80px' }} />
        <Column field="confidence" header="Confianza" body={confidenceBody} sortable style={{ width: '110px' }} />
      </DataTable>
    </div>
  )
}
