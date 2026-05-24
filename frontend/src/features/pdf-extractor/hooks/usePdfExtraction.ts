import { useMutation } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { setJob, setStatus, setError } from '../store/pdfSlice'
import { extractEntities } from '../api/pdfApi'

export function usePdfExtraction() {
  const dispatch = useAppDispatch()
  const { job, status, entityFilter, error } = useAppSelector(s => s.pdf)

  const mutation = useMutation({
    mutationFn: extractEntities,
    onMutate: () => {
      dispatch(setStatus('uploading'))
      dispatch(setError(null))
    },
    onSuccess: data => {
      dispatch(setJob(data))
      dispatch(setStatus(data.status))
    },
    onError: (err: Error) => {
      dispatch(setStatus('error'))
      dispatch(setError(err.message))
    },
  })

  function upload(file: File) {
    mutation.mutate(file)
  }

  return { job, status, entityFilter, error, upload, isUploading: mutation.isPending }
}
