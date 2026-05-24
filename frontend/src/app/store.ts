import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import chatReducer from '@/features/chat/store/chatSlice'
import pdfReducer from '@/features/pdf-extractor/store/pdfSlice'
import dashboardReducer from '@/features/dashboard/store/dashboardSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    pdf: pdfReducer,
    dashboard: dashboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
