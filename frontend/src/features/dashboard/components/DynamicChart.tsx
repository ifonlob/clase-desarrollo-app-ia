import { useRef, useMemo } from 'react'
import { Chart } from 'primereact/chart'
import { Button } from 'primereact/button'
import type { ChartConfig, CsvDataset } from '@/shared/types/dashboard.types'

interface Props {
  dataset: CsvDataset
  config: ChartConfig
}

const PALETTE = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
]

export default function DynamicChart({ dataset, config }: Props) {
  const chartRef = useRef<Chart>(null)

  const chartData = useMemo(() => {
    const rows = dataset.rows

    if (config.groupBy) {
      const groups = [...new Set(rows.map(r => r[config.groupBy!]))].filter(Boolean)
      const labels = [...new Set(rows.map(r => r[config.xAxis]))].filter(Boolean)

      const datasets = groups.map((group, idx) => {
        const data = labels.map(label => {
          const matching = rows.filter(r => r[config.xAxis] === label && r[config.groupBy!] === group)
          const sum = matching.reduce((acc, r) => acc + (parseFloat(r[config.yAxis]) || 0), 0)
          return matching.length > 0 ? sum / matching.length : 0
        })
        return { label: group, data, backgroundColor: PALETTE[idx % PALETTE.length], borderColor: PALETTE[idx % PALETTE.length] }
      })

      return { labels, datasets }
    }

    const grouped: Record<string, number[]> = {}
    rows.forEach(r => {
      const key = r[config.xAxis]
      if (!key) return
      if (!grouped[key]) grouped[key] = []
      const val = parseFloat(r[config.yAxis])
      if (!isNaN(val)) grouped[key].push(val)
    })

    const labels = Object.keys(grouped)
    const data = labels.map(k => {
      const vals = grouped[k]
      return vals.reduce((a, b) => a + b, 0) / vals.length
    })

    return {
      labels,
      datasets: [
        {
          label: config.yAxis,
          data,
          backgroundColor: PALETTE,
          borderColor: PALETTE[0],
          fill: config.type === 'area',
          tension: 0.4,
        },
      ],
    }
  }, [dataset, config])

  const chartType = config.type === 'area' ? 'line' : config.type === 'scatter' ? 'scatter' : config.type

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: !!config.title, text: config.title },
    },
  }

  function downloadPng() {
    const canvas = (chartRef.current as unknown as { getChart?: () => { toBase64Image: () => string } })?.getChart?.()
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${config.title || 'grafica'}.png`
    link.href = canvas.toBase64Image()
    link.click()
  }

  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{config.title || `${config.yAxis} por ${config.xAxis}`}</h3>
        <Button icon="pi pi-download" label="PNG" text onClick={downloadPng} />
      </div>
      <Chart ref={chartRef} type={chartType} data={chartData} options={options} />
    </div>
  )
}
