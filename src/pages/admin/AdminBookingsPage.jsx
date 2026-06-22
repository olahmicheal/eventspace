import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Loader2 } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import AdminSidebar from '../../components/admin/AdminSidebar'
import PaymentForm from '../../components/admin/PaymentForm'
import { formatPriceFull, formatDate } from '../../lib/utils'

export default function AdminBookingsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, bookings, fetchBookings, updateBookingStatus } = useAdminStore()
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login')
    fetchBookings()
  }, [isAuthenticated, navigate, fetchBookings])

  if (!isAuthenticated) return null

  const handleApprove = (booking) => {
    setSelectedBooking(booking)
    setShowPaymentForm(true)
  }

  const handleReject = async (bookingId) => {
    if (!confirm('Are you sure you want to reject this booking?')) return
    
    setIsProcessing(true)
    await updateBookingStatus(bookingId, 'cancelled')
    setIsProcessing(false)
  }

  const handlePaymentSubmit = async (paymentDetails) => {
    if (!selectedBooking) return
    
    setIsProcessing(true)
    setShowPaymentForm(false)
    
    // Update booking with payment details and confirm
    await updateBookingStatus(selectedBooking.id, 'confirmed', paymentDetails)
    
    setSelectedBooking(null)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

          {/* Payment Form Modal */}
          {showPaymentForm && selectedBooking && (
            <PaymentForm
              booking={selectedBooking}
              onSubmit={handlePaymentSubmit}
              onCancel={() => {
                setShowPaymentForm(false)
                setSelectedBooking(null)
              }}
            />
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex items-center gap-3">
                <Loader2 size={24} className="animate-spin text-primary-600" />
                <span className="font-medium">Processing...</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.id.slice(0, 8)}</td>
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
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(booking)}
                              className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleReject(booking.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <span className="text-xs text-blue-600 flex items-center gap-1"><Check size={14} /> Paid</span>
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