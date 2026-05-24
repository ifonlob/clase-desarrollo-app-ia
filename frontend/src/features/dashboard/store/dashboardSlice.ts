import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChartConfig, CsvDataset } from '@/shared/types/dashboard.types'

interface DashboardState {
  dataset: CsvDataset | null
  chartConfig: ChartConfig | null
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  dataset: null,
  chartConfig: null,
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDataset(state, action: PayloadAction<CsvDataset>) {
      state.dataset = action.payload
      state.chartConfig = null
    },
    setChartConfig(state, action: PayloadAction<ChartConfig>) {
      state.chartConfig = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    resetDashboard(state) {
      state.dataset = null
      state.chartConfig = null
      state.isLoading = false
      state.error = null
    },
  },
})

export const { setDataset, setChartConfig, setLoading, setError, resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
