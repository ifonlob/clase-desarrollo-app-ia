import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useAppDispatch } from '@/app/store'
import { setChartConfig } from '../store/dashboardSlice'
import type { ChartConfig, ChartType, CsvColumn } from '@/shared/types/dashboard.types'

const CHART_TYPES: Array<{ value: ChartType; label: string; icon: string }> = [
  { value: 'bar', label: 'Barras', icon: 'pi-chart-bar' },
  { value: 'line', label: 'Líneas', icon: 'pi-chart-line' },
  { value: 'pie', label: 'Pastel', icon: 'pi-chart-pie' },
  { value: 'scatter', label: 'Dispersión', icon: 'pi-circle' },
  { value: 'area', label: 'Área', icon: 'pi-chart-line' },
]

interface Props {
  columns: CsvColumn[]
}

export default function ChartSelector({ columns }: Props) {
  const dispatch = useAppDispatch()
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [xAxis, setXAxis] = useState(columns[0]?.name ?? '')
  const [yAxis, setYAxis] = useState(columns.find(c => c.type === 'numeric')?.name ?? '')
  const [groupBy, setGroupBy] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const columnOptions = columns.map(c => ({ label: `${c.name} (${c.type})`, value: c.name }))
  const nullableOptions = [{ label: 'Ninguno', value: null }, ...columnOptions]

  function generate() {
    if (!xAxis || !yAxis) return
    const config: ChartConfig = { type: chartType, xAxis, yAxis, groupBy, title }
    dispatch(setChartConfig(config))
  }

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-700">Configurar gráfica</h3>

      <div>
        <label className="text-sm text-gray-500 block mb-2">Tipo de gráfica</label>
        <div className="flex gap-2 flex-wrap">
          {CHART_TYPES.map(ct => (
            <button
              key={ct.value}
              onClick={() => setChartType(ct.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                chartType === ct.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              <i className={`pi ${ct.icon}`} />
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-gray-500 block mb-1">Eje X</label>
          <Dropdown value={xAxis} options={columnOptions} onChange={e => setXAxis(e.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Eje Y</label>
          <Dropdown value={yAxis} options={columnOptions} onChange={e => setYAxis(e.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Agrupar por</label>
          <Dropdown value={groupBy} options={nullableOptions} onChange={e => setGroupBy(e.value)} className="w-full" />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-500 block mb-1">Título</label>
        <InputText
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título de la gráfica"
          className="w-full"
        />
      </div>

      <Button label="Generar gráfica" icon="pi pi-chart-bar" onClick={generate} disabled={!xAxis || !yAxis} />
    </div>
  )
}
