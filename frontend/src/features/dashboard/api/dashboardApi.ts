import type { CsvDataset } from '@/shared/types/dashboard.types'

function mapDataset(data: Record<string, unknown>): Omit<CsvDataset, 'rows'> {
  return {
    id: data.dataset_id as string,
    filename: data.filename as string,
    rowCount: data.row_count as number,
    columns: ((data.columns as Array<Record<string, unknown>>) ?? []).map(c => ({
      name: c.name as string,
      type: c.type as CsvDataset['columns'][number]['type'],
      sampleValues: c.sample_values as string[],
    })),
  }
}

export async function uploadCsv(file: File): Promise<Omit<CsvDataset, 'rows'>> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/v1/dashboard/parse', { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`CSV upload error: ${res.statusText}`)
  return mapDataset(await res.json())
}

export async function fetchDataset(datasetId: string): Promise<Omit<CsvDataset, 'rows'>> {
  const res = await fetch(`/api/v1/dashboard/datasets/${datasetId}`)
  if (!res.ok) throw new Error(`Dataset fetch error: ${res.statusText}`)
  return mapDataset(await res.json())
}
