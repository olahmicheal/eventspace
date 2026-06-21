import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function TermsPage() {
  const navigate = useNavigate()

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using EventSpace, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.'
    },
    {
      title: '2. Booking & Payments',
      content: 'All bookings are subject to venue availability. A booking is only confirmed after full payment has been received and verified by the venue owner. EventSpace acts as an intermediary platform and is not responsible for venue quality or service delivery.'
    },
    {
      title: '3. Cancellation Policy',
      content: 'Cancellations made more than 48 hours before the event date are eligible for a full refund. Cancellations within 48 hours may incur a 50% cancellation fee. No-shows are not eligible for refunds.'
    },
    {
      title: '4. User Responsibilities',
      content: 'Users must provide accurate information during booking. You are responsible for complying with venue house rules and local regulations. Damage caused by you or your guests is your financial responsibility.'
    },
    {
      title: '5. Venue Owner Obligations',
      content: 'Venue owners must ensure their listings are accurate and up-to-date. They must honor confirmed bookings and maintain the venue to the standard advertised.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'EventSpace is not liable for disputes between users and venues. Our maximum liability is limited to the service fees paid to EventSpace.'
    }
  ]

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: June 2026</p>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}