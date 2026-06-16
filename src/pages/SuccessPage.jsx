import { useNavigate } from 'react-router-dom'
import { Check, Calendar, Clock, MapPin } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function SuccessPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" strokeWidth={3} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Your booking request has been submitted. The venue will contact you shortly to confirm availability.
          </p>

          <div className="bg-white rounded-2xl p-5 card-shadow mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Event Date</p>
                  <p className="text-sm font-medium text-gray-900">Pending Confirmation</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">Pending Confirmation</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium text-amber-600">Awaiting Venue Response</p>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/')}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25">
            Back to Home
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}