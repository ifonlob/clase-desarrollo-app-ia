import type { PdfExtractionJob } from '@/shared/types/pdf.types'

export const MOCK_PDF_JOB: PdfExtractionJob = {
  jobId: 'mock-job-1',
  filename: 'granada_turismo.pdf',
  status: 'done',
  pageCount: 12,
  processedAt: new Date().toISOString(),
  entities: [
    { id: 'e01', type: 'LOCATION', value: 'Granada', context: 'La ciudad de Granada, capital de la provincia homónima en Andalucía, es conocida mundialmente por su legado nazarí.', confidence: 0.98, pageNumber: 1 },
    { id: 'e02', type: 'MONUMENT', value: 'La Alhambra', context: 'La Alhambra es el conjunto monumental más visitado de España, con más de 2,5 millones de visitantes anuales.', confidence: 0.97, pageNumber: 1 },
    { id: 'e03', type: 'LOCATION', value: 'Sierra Nevada', context: 'La Sierra Nevada, situada al sureste de Granada, alberga el punto más alto de la Península Ibérica.', confidence: 0.95, pageNumber: 2 },
    { id: 'e04', type: 'MONUMENT', value: 'Catedral de Granada', context: 'La Catedral de Granada, construida sobre la antigua mezquita mayor, es un referente del Renacimiento español.', confidence: 0.93, pageNumber: 2 },
    { id: 'e05', type: 'PERSON', value: 'Carlos V', context: 'El emperador Carlos V ordenó la construcción de su palacio dentro del recinto de la Alhambra en el siglo XVI.', confidence: 0.91, pageNumber: 3 },
    { id: 'e06', type: 'PERSON', value: 'Isabel la Católica', context: 'Isabel la Católica eligió Granada como su lugar de descanso eterno; está enterrada en la Capilla Real.', confidence: 0.96, pageNumber: 3 },
    { id: 'e07', type: 'DATE', value: '1492', context: 'En 1492, los Reyes Católicos completaron la Reconquista con la toma de Granada, el último reino musulmán.', confidence: 0.99, pageNumber: 4 },
    { id: 'e08', type: 'EVENT', value: 'Reconquista', context: 'La Reconquista culminó en Granada con la rendición de Boabdil ante los Reyes Católicos el 2 de enero de 1492.', confidence: 0.97, pageNumber: 4 },
    { id: 'e09', type: 'LOCATION', value: 'Sacromonte', context: 'El barrio del Sacromonte, famoso por sus cuevas y el flamenco gitano, es uno de los más singulares de Granada.', confidence: 0.88, pageNumber: 5 },
    { id: 'e10', type: 'ORGANIZATION', value: 'Patronato de la Alhambra', context: 'El Patronato de la Alhambra y el Generalife gestiona el acceso y la conservación del conjunto monumental nazarí.', confidence: 0.92, pageNumber: 5 },
    { id: 'e11', type: 'MONUMENT', value: 'El Generalife', context: 'El Generalife, palacio de veraneo de los sultanes nazaríes, destaca por sus jardines con fuentes y cipreses.', confidence: 0.94, pageNumber: 6 },
    { id: 'e12', type: 'EVENT', value: 'Festival Internacional de Música y Danza', context: 'El Festival Internacional de Música y Danza de Granada se celebra cada junio-julio en los Palacios Nazaríes.', confidence: 0.86, pageNumber: 7 },
    { id: 'e13', type: 'DATE', value: 'siglo XIV', context: 'La mayor parte de los Palacios Nazaríes fue construida durante el siglo XIV, bajo los reinados de Yusuf I y Muhammad V.', confidence: 0.89, pageNumber: 8 },
    { id: 'e14', type: 'PERSON', value: 'Boabdil', context: 'Boabdil, último rey nazarí de Granada, entregó las llaves de la ciudad a los Reyes Católicos en 1492.', confidence: 0.94, pageNumber: 8 },
    { id: 'e15', type: 'LOCATION', value: 'Albaicín', context: 'El barrio del Albaicín, declarado Patrimonio de la Humanidad por la UNESCO, conserva el trazado de la medina medieval.', confidence: 0.96, pageNumber: 9 },
    { id: 'e16', type: 'ORGANIZATION', value: 'UNESCO', context: 'La UNESCO declaró la Alhambra, el Generalife y el Albaicín Patrimonio de la Humanidad en 1984 y 1994 respectivamente.', confidence: 0.98, pageNumber: 9 },
    { id: 'e17', type: 'MONUMENT', value: 'Capilla Real', context: 'La Capilla Real, construida entre 1505 y 1517, alberga los sepulcros de los Reyes Católicos.', confidence: 0.91, pageNumber: 10 },
    { id: 'e18', type: 'EVENT', value: 'Nochebuena Flamenca', context: 'La Nochebuena Flamenca es una de las celebraciones más emblemáticas del Sacromonte, con actuaciones en las cuevas.', confidence: 0.72, pageNumber: 11 },
  ],
}
