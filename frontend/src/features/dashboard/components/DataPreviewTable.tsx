import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import type { CsvDataset } from '@/shared/types/dashboard.types'

interface Props {
  dataset: CsvDataset
}

export default function DataPreviewTable({ dataset }: Props) {
  const preview = dataset.rows.slice(0, 50)

  return (
    <DataTable
      value={preview}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50]}
      scrollable
      scrollHeight="400px"
      size="small"
      emptyMessage="Sin datos."
      virtualScrollerOptions={dataset.columns.length > 10 ? { itemSize: 36 } : undefined}
    >
      {dataset.columns.map(col => (
        <Column key={col.name} field={col.name} header={col.name} sortable />
      ))}
    </DataTable>
  )
}
