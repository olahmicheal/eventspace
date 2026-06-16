import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MessageCircle } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { formatDate, generateAdminWhatsAppLink } from '../../lib/utils'

export default function AdminComplaintsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, complaints, updateComplaintStatus } = useAdminStore()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
            <a href={generateAdminWhatsAppLink()} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2.5 bg-whatsapp text-white text-sm font-semibold rounded-xl flex items-center gap-2">
              <MessageCircle size={18} /> WhatsApp Support
            </a>
          </div>

          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className={`bg-white rounded-xl p-6 card-shadow ${
                complaint.status === 'open' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{complaint.subject}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        complaint.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">From: {complaint.customerName} • {complaint.phone} • {formatDate(complaint.createdAt)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {complaint.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">{complaint.message}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Venue: {complaint.venueName}</p>
                  {complaint.status === 'open' && (
                    <button onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                      className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg flex items-center gap-1.5 hover:bg-green-200 transition-colors">
                      <Check size={16} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}