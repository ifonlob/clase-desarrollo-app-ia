import { useRef } from 'react'
import { ProgressBar } from 'primereact/progressbar'
import { useCsvParse } from '../hooks/useCsvParse'

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

export default function CsvUploader() {
  const { parse, isLoading } = useCsvParse()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.name.toLowerCase().match(/\.(csv|tsv)$/)) {
      alert('Solo se aceptan archivos .csv o .tsv')
      return
    }
    if (file.size > MAX_SIZE) {
      alert('El archivo supera el límite de 50 MB.')
      return
    }
    parse(file)
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
      >
        <i className="pi pi-file-excel text-5xl text-gray-300 mb-4 block" />
        <p className="text-gray-600 font-medium">Arrastra un CSV/TSV aquí o haz clic para seleccionar</p>
        <p className="text-sm text-gray-400 mt-1">Máximo 50 MB · .csv o .tsv</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.tsv"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {isLoading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Procesando archivo…</p>
          <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
        </div>
      )}
    </div>
  )
}
