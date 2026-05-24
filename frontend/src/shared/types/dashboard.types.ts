export type ColumnType = 'numeric' | 'categorical' | 'date'

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area'

export interface CsvColumn {
  name: string
  type: ColumnType
  sampleValues: string[]
}

export interface CsvDataset {
  id: string
  filename: string
  rowCount: number
  columns: CsvColumn[]
  rows: Record<string, string>[]
}

export interface ChartConfig {
  type: ChartType
  xAxis: string
  yAxis: string
  groupBy: string | null
  title: string
}
