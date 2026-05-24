import { useState } from 'react'
import Papa from 'papaparse'
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '@/app/store'
import { setDataset, setError, setLoading } from '../store/dashboardSlice'
import { uploadCsv } from '../api/dashboardApi'
import type { ColumnType, CsvColumn, CsvDataset } from '@/shared/types/dashboard.types'

const MAX_PREVIEW_ROWS = 1000

function inferColumnType(values: string[]): ColumnType {
  const sample = values.filter(Boolean).slice(0, 20)
  const numericCount = sample.filter(v => !isNaN(Number(v)) && v.trim() !== '').length
  if (numericCount / sample.length > 0.8) return 'numeric'
  const datePattern = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/
  const dateCount = sample.filter(v => datePattern.test(v)).length
  if (dateCount / sample.length > 0.8) return 'date'
  return 'categorical'
}

export function useCsvParse() {
  const dispatch = useAppDispatch()
  const [previewReady, setPreviewReady] = useState(false)

  const mutation = useMutation({
    mutationFn: uploadCsv,
    onSuccess: (serverData, file) => {
      parseLocally(file, serverData.id)
    },
    onError: (err: Error) => {
      dispatch(setError(err.message))
      dispatch(setLoading(false))
    },
  })

  function parseLocally(file: File, datasetId: string) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        const rows = result.data.slice(0, MAX_PREVIEW_ROWS)
        const headers = result.meta.fields ?? []

        const columns: CsvColumn[] = headers.map(name => {
          const vals = rows.map(r => r[name] ?? '').filter(Boolean)
          return {
            name,
            type: inferColumnType(vals),
            sampleValues: vals.slice(0, 5),
          }
        })

        const dataset: CsvDataset = {
          id: datasetId,
          filename: file.name,
          rowCount: result.data.length,
          columns,
          rows,
        }

        dispatch(setDataset(dataset))
        dispatch(setLoading(false))
        setPreviewReady(true)
      },
      error: () => {
        dispatch(setError('Error al parsear el CSV'))
        dispatch(setLoading(false))
      },
    })
  }

  function parse(file: File) {
    dispatch(setLoading(true))
    dispatch(setError(null))
    setPreviewReady(false)
    mutation.mutate(file)
  }

  return { parse, isLoading: mutation.isPending, previewReady }
}
