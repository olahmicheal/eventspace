import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2, CalendarDays, MessageSquare } from 'lucide-react'
import { APP_NAME } from '../../lib/constants'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/venues', icon: Building2, label: 'Venues' },
  { to: '/admin/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/admin/complaints', icon: MessageSquare, label: 'Complaints' },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40">
      <div className="p-6">
        <h1 className="text-xl font-bold gradient-text">{APP_NAME}</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-whatsapp/10 text-whatsapp rounded-xl text-sm font-medium hover:bg-whatsapp/20 transition-colors">
          <MessageSquare size={18} />
          WhatsApp Support
        </a>
      </div>
    </aside>
  )
}