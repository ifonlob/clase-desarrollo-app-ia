import type { CsvDataset } from '@/shared/types/dashboard.types'

const CIUDADES = ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Granada', 'Bilbao', 'San Sebastián', 'Málaga', 'Córdoba', 'Toledo']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const TIPOS = ['cultural', 'playa', 'rural', 'gastronómico']

function generateRows(): Record<string, string>[] {
  const rows: Record<string, string>[] = []
  for (const ciudad of CIUDADES) {
    for (const mes of MESES) {
      const base = Math.floor(Math.random() * 100000) + 20000
      rows.push({
        ciudad,
        mes,
        visitantes: String(base),
        valoracion_media: (Math.random() * 2 + 3).toFixed(1),
        tipo_turismo: TIPOS[Math.floor(Math.random() * TIPOS.length)],
      })
    }
  }
  return rows
}

export const MOCK_DATASET: CsvDataset = {
  id: 'mock-dataset-1',
  filename: 'turismo_espana.csv',
  rowCount: 120,
  columns: [
    { name: 'ciudad', type: 'categorical', sampleValues: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Granada'] },
    { name: 'mes', type: 'categorical', sampleValues: ['enero', 'febrero', 'marzo', 'abril', 'mayo'] },
    { name: 'visitantes', type: 'numeric', sampleValues: ['125000', '98500', '67300', '145200', '89000'] },
    { name: 'valoracion_media', type: 'numeric', sampleValues: ['4.2', '4.5', '3.9', '4.7', '4.1'] },
    { name: 'tipo_turismo', type: 'categorical', sampleValues: ['cultural', 'playa', 'rural', 'gastronómico', 'cultural'] },
  ],
  rows: generateRows(),
}
