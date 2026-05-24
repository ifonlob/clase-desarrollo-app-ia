import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EntityType, ExtractionStatus, PdfExtractionJob } from '@/shared/types/pdf.types'

interface PdfState {
  job: PdfExtractionJob | null
  status: ExtractionStatus
  entityFilter: EntityType | 'ALL'
  error: string | null
}

const initialState: PdfState = {
  job: null,
  status: 'idle',
  entityFilter: 'ALL',
  error: null,
}

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    setJob(state, action: PayloadAction<PdfExtractionJob>) {
      state.job = action.payload
    },
    setStatus(state, action: PayloadAction<ExtractionStatus>) {
      state.status = action.payload
    },
    setEntityFilter(state, action: PayloadAction<EntityType | 'ALL'>) {
      state.entityFilter = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    resetPdf(state) {
      state.job = null
      state.status = 'idle'
      state.entityFilter = 'ALL'
      state.error = null
    },
  },
})

export const { setJob, setStatus, setEntityFilter, setError, resetPdf } = pdfSlice.actions
export default pdfSlice.reducer
