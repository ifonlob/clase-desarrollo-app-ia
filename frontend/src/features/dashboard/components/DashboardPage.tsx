import { Message } from 'primereact/message'
import { Badge } from 'primereact/badge'
import { useAppSelector } from '@/app/store'
import CsvUploader from './CsvUploader'
import ChartSelector from './ChartSelector'
import DynamicChart from './DynamicChart'
import DataPreviewTable from './DataPreviewTable'

export default function DashboardPage() {
  const { dataset, chartConfig, error } = useAppSelector(s => s.dashboard)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard CSV</h1>
        <p className="text-gray-500">Sube un CSV y genera gráficas interactivas de datos turísticos.</p>
      </div>

      <CsvUploader />

      {error && <Message severity="error" text={error} className="w-full" />}

      {dataset && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-700">{dataset.filename}</h2>
            <Badge value={`${dataset.rowCount} filas`} severity="info" />
            <Badge value={`${dataset.columns.length} columnas`} severity="secondary" />
          </div>

          <ChartSelector columns={dataset.columns} />

          {chartConfig && <DynamicChart dataset={dataset} config={chartConfig} />}

          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-3">Vista previa (primeras 50 filas)</h3>
            <DataPreviewTable dataset={dataset} />
          </div>
        </div>
      )}
    </div>
  )
}
