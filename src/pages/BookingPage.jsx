import { useParams } from 'react-router-dom'
import BackButton from '../components/layout/BackButton'
import WhatsAppFAB from '../components/layout/WhatsAppFAB'
import Footer from '../components/layout/Footer'
import BookingForm from '../components/booking/BookingForm'
import { getVenueById } from '../data/mockVenues'

export default function BookingPage() {
  const { id } = useParams()
  const venue = getVenueById(id)

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Venue not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <BackButton />
          <div className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl shadow-sm">
            Request Booking
          </div>
        </div>
      </div>

      <main className="flex-1">
        <BookingForm />
      </main>

      <Footer />
      <WhatsAppFAB venueName={venue.name} />
    </div>
  )
}