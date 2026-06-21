import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Your data, your control.</p>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Data Protection</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use industry-standard encryption to protect your personal information. 
              Your data is stored securely and never sold to third parties.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Eye size={20} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">What We Collect</h2>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Name and contact information for bookings</li>
              <li>• Event details and preferences</li>
              <li>• Payment information (processed securely)</li>
              <li>• Device and usage data for platform improvement</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Lock size={20} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">How We Use It</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use your data to process bookings, send confirmations, improve our service, 
              and comply with legal obligations. We only share data with venues you've booked.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Trash2 size={20} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Your Rights</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              You can request access to, correction of, or deletion of your personal data at any time. 
              Contact us at privacy@eventspace.ng.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}