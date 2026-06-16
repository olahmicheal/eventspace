import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { formatPriceFull, formatDate } from '../../lib/utils'

export default function AdminBookingsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, bookings, updateBookingStatus } = useAdminStore()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

          <div className="bg-white rounded-xl card-shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Customer</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Venue</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.venueName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(booking.eventDate)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatPriceFull(booking.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check size={18} /></button>
                            <button onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X size={18} /></button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <span className="text-xs text-green-600 flex items-center gap-1"><Check size={14} /> Approved</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}