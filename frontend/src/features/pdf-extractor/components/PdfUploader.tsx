import { useRef } from 'react'
import { ProgressBar } from 'primereact/progressbar'
import { usePdfExtraction } from '../hooks/usePdfExtraction'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

interface Props {
  onFileSelected?: (file: File) => void
}

export default function PdfUploader({ onFileSelected }: Props) {
  const { upload, isUploading, status } = usePdfExtraction()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Solo se aceptan archivos PDF.')
      return
    }
    if (file.size > MAX_SIZE) {
      alert('El archivo supera el límite de 10 MB.')
      return
    }
    onFileSelected?.(file)
    upload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <i className="pi pi-file-pdf text-5xl text-gray-300 mb-4 block" />
        <p className="text-gray-600 font-medium">Arrastra un PDF aquí o haz clic para seleccionar</p>
        <p className="text-sm text-gray-400 mt-1">Máximo 10 MB · solo .pdf</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            {status === 'uploading' ? 'Subiendo archivo…' : 'Extrayendo entidades…'}
          </p>
          <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
        </div>
      )}
    </div>
  )
}
