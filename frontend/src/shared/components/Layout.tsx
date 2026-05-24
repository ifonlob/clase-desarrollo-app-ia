import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Button } from 'primereact/button'
import Sidebar from './Sidebar'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-full">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center gap-2 px-4 py-3 bg-white border-b shadow-sm">
          <Button
            icon={collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'}
            text
            rounded
            onClick={() => setCollapsed(c => !c)}
            className="text-gray-500"
            aria-label="Toggle sidebar"
          />
          <span className="text-gray-400 text-sm ml-auto">Asistente Turístico IA</span>
        </header>

        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
