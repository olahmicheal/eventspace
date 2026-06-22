import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, Users, AlertCircle, Building, MessageSquare, TrendingUp, Percent, Wallet } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import AdminSidebar from '../../components/admin/AdminSidebar'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { isAuthenticated, bookings, getStats, logout } = useAdminStore()
  const stats = getStats()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  // Revenue calculation - internal commission tracking
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)

  const totalCommission = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.commission_amount || 0), 0)

  const netRevenue = totalRevenue - totalCommission

  const statCards = [
    { icon: Calendar, label: 'Total Bookings', value: stats.totalBookings, color: 'bg-blue-50 text-blue-600' },
    { icon: DollarSign, label: 'Revenue (₦)', value: `₦${(stats.totalRevenue / 1000000).toFixed(1)}M`, color: 'bg-green-50 text-green-600' },
    { icon: Users, label: 'Pending', value: stats.pendingBookings, color: 'bg-amber-50 text-amber-600' },
    { icon: Building, label: 'Confirmed', value: stats.confirmedBookings, color: 'bg-purple-50 text-purple-600' },
    { icon: AlertCircle, label: 'Open Complaints', value: stats.openComplaints, color: 'bg-red-50 text-red-600' },
    { icon: MessageSquare, label: 'Resolved', value: stats.resolvedComplaints, color: 'bg-primary-50 text-primary-600' },
  ]

  // Revenue breakdown cards
  const revenueCards = [
    { 
      icon: Wallet, 
      label: 'Total Collected', 
      value: `₦${totalRevenue.toLocaleString()}`, 
      color: 'bg-blue-50 text-blue-600',
      description: 'From completed bookings'
    },
    { 
      icon: Percent, 
      label: 'Our Commission', 
      value: `₦${totalCommission.toLocaleString()}`, 
      color: 'bg-green-50 text-green-600',
      description: 'Internal revenue tracking'
    },
    { 
      icon: TrendingUp, 
      label: 'Net to Venue', 
      value: `₦${netRevenue.toLocaleString()}`, 
      color: 'bg-purple-50 text-purple-600',
      description: 'Amount to pay venue owners'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, Admin</p>
            </div>
            <button onClick={() => { logout(); navigate('/admin/login') }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Logout
            </button>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Breakdown */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown</h2>
            <div className="grid grid-cols-3 gap-4">
              {revenueCards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                      <card.icon size={20} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{card.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h3>
              <div className="space-y-3">
                {useAdminStore.getState().bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.venueName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Complaints</h3>
              <div className="space-y-3">
                {useAdminStore.getState().complaints.slice(0, 3).map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{complaint.subject}</p>
                      <p className="text-xs text-gray-500">{complaint.customerName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      complaint.priority === 'high' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}