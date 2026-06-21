import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, AlertTriangle, HeartHandshake } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function SafetyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Safety Guidelines</h1>
        <p className="text-sm text-gray-500 mb-6">Your safety is our priority.</p>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={24} className="text-green-600" />
              <h2 className="font-semibold text-gray-900">Verified Venues</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              All venues on EventSpace are verified. We conduct physical inspections and 
              verify ownership documents before listing.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={24} className="text-amber-600" />
              <h2 className="font-semibold text-gray-900">Report Issues</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you encounter any safety concerns at a venue, report immediately through 
              our Help page or call our emergency line: +234 800 000 0000.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <HeartHandshake size={24} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">Secure Payments</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              All payments are held in escrow until your event is successfully completed. 
              This protects both you and the venue owner.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}