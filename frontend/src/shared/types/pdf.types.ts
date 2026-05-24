export type EntityType =
  | 'LOCATION'
  | 'MONUMENT'
  | 'PERSON'
  | 'DATE'
  | 'ORGANIZATION'
  | 'EVENT'

export type ExtractionStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export interface ExtractedEntity {
  id: string
  type: EntityType
  value: string
  context: string
  confidence: number
  pageNumber: number
}

export interface PdfExtractionJob {
  jobId: string
  filename: string
  status: ExtractionStatus
  entities: ExtractedEntity[]
  pageCount: number | null
  processedAt: string | null
}
