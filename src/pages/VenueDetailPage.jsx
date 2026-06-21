import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Users, Star, Heart } from 'lucide-react'
import { useVenueStore } from '../stores/venueStore'
import BackButton from '../components/layout/BackButton'
import WhatsAppFAB from '../components/layout/WhatsAppFAB'
import Footer from '../components/layout/Footer'
import VenueGallery from '../components/venue/VenueGallery'
import AmenityGrid from '../components/venue/AmenityGrid'
import PerfectFor from '../components/venue/PerfectFor'
import HouseRules from '../components/venue/HouseRules'
import PricingCard from '../components/venue/PricingCard'

export default function VenueDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { venues, fetchVenues, isFavorite, toggleFavorite } = useVenueStore()

  useEffect(() => {
    if (venues.length === 0) {
      fetchVenues()
    }
  }, [venues.length, fetchVenues])

  const venue = venues.find(v => v.id === id)
  const isFav = isFavorite(id)

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
          <button onClick={() => navigate(`/booking/${venue.id}`)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
            Request Booking
          </button>
        </div>
      </div>

      <main className="flex-1">
        <VenueGallery images={venue.images} venueName={venue.name} />

        <div className="px-4 py-4">
          <div className="max-w-lg mx-auto">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{venue.name}</h1>
              <button onClick={() => toggleFavorite(venue.id)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <Heart size={20} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
              <MapPin size={14} /><span>{venue.location}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              <Users size={14} /><span>Up to {venue.capacity} guests</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-gray-800">{venue.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({venue.reviewCount} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {venue.tags?.map((tag, i) => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{tag}</span>)}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{venue.description}</p>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="max-w-lg mx-auto">
            <PricingCard price={venue.pricePerHour} originalPrice={venue.originalPrice} discount={venue.discount}
              minimumHours={venue.minimumHours} currency={venue.currency} />
          </div>
        </div>

        <AmenityGrid amenities={venue.amenities} />
        <PerfectFor tags={venue.perfectFor} />
        <HouseRules rules={venue.houseRules} />

        <div className="px-4 py-6 pb-6">
          <div className="max-w-lg mx-auto">
            <button onClick={() => navigate(`/booking/${venue.id}`)}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25">
              Request Booking <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFAB venueName={venue.name} />
    </div>
  )
}