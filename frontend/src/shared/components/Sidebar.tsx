import { Link } from '@tanstack/react-router'

const NAV_ITEMS = [
  { to: '/chat', icon: 'pi-comments', label: 'Chat Agente' },
  { to: '/pdf', icon: 'pi-file-pdf', label: 'Extractor PDF' },
  { to: '/dashboard', icon: 'pi-chart-bar', label: 'Dashboard CSV' },
] as const

interface Props {
  collapsed: boolean
}

export default function Sidebar({ collapsed }: Props) {
  return (
    <aside
      className="flex flex-col bg-gray-900 text-white transition-all duration-200"
      style={{ width: collapsed ? '64px' : '220px' }}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <i className="pi pi-compass text-blue-400 text-2xl flex-shrink-0" />
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight whitespace-nowrap">TDAI</span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors no-underline"
            activeProps={{ className: 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 text-white no-underline' }}
          >
            <i className={`pi ${icon} text-lg flex-shrink-0`} />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
