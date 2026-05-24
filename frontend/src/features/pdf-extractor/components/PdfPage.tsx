import { Message } from 'primereact/message'
import { Badge } from 'primereact/badge'
import { useAppSelector } from '@/app/store'
import PdfUploader from './PdfUploader'
import EntityTable from './EntityTable'
import EntityCard from './EntityCard'

export default function PdfPage() {
  const { job, status, error } = useAppSelector(s => s.pdf)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Extractor de Entidades PDF</h1>
        <p className="text-gray-500">Sube un PDF turístico y extrae lugares, monumentos, personas y más.</p>
      </div>

      <PdfUploader />

      {error && <Message severity="error" text={error} className="w-full" />}

      {job && status === 'done' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-700">{job.filename}</h2>
            <Badge value={`${job.entities.length} entidades`} severity="info" />
            {job.pageCount && (
              <Badge value={`${job.pageCount} páginas`} severity="secondary" />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {job.entities.slice(0, 6).map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-3">Todas las entidades</h3>
            <EntityTable entities={job.entities} />
          </div>
        </div>
      )}
    </div>
  )
}
