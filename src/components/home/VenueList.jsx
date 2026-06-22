import { useState, useEffect } from 'react'
import { useVenueStore } from '../../stores/venueStore'
import VenueCard from '../venue/VenueCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function VenueList() {
  const filteredVenues = useVenueStore((state) => state.getFilteredVenues())
  const [currentPage, setCurrentPage] = useState(1)
  const venuesPerPage = 8

  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage)
  const startIndex = (currentPage - 1) * venuesPerPage
  const currentVenues = filteredVenues.slice(startIndex, startIndex + venuesPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredVenues.length])

  if (filteredVenues.length === 0) {
    return (
      <section className="px-4 py-8 pb-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-500">No venues found matching your criteria.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-4 pb-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Discover Premium Venues</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filteredVenues.length} venues available • Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {currentVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}