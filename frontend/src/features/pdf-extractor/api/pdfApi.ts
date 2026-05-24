import type { PdfExtractionJob } from '@/shared/types/pdf.types'

function mapJob(data: Record<string, unknown>): PdfExtractionJob {
  return {
    jobId: data.job_id as string,
    filename: data.filename as string,
    status: data.status as PdfExtractionJob['status'],
    entities: ((data.entities as Array<Record<string, unknown>>) ?? []).map(e => ({
      id: e.id as string,
      type: e.type as PdfExtractionJob['entities'][number]['type'],
      value: e.value as string,
      context: e.context as string,
      confidence: e.confidence as number,
      pageNumber: e.page_number as number,
    })),
    pageCount: (data.page_count as number | null) ?? null,
    processedAt: (data.processed_at as string | null) ?? null,
  }
}

export async function extractEntities(file: File): Promise<PdfExtractionJob> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/v1/pdf/extract', { method: 'POST', body: formData })
  if (!res.ok) throw new Error(`PDF extract error: ${res.statusText}`)
  return mapJob(await res.json())
}

export async function getJob(jobId: string): Promise<PdfExtractionJob> {
  const res = await fetch(`/api/v1/pdf/${jobId}`)
  if (!res.ok) throw new Error(`Job fetch error: ${res.statusText}`)
  return mapJob(await res.json())
}
