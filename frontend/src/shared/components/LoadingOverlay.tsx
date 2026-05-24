import { ProgressSpinner } from 'primereact/progressspinner'

interface Props {
  isLoading: boolean
  message?: string
}

export default function LoadingOverlay({ isLoading, message }: Props) {
  if (!isLoading) return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-50">
      <ProgressSpinner style={{ width: '48px', height: '48px' }} />
      {message && <p className="mt-3 text-gray-600">{message}</p>}
    </div>
  )
}
