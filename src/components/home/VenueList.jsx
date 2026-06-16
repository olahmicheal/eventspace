import { useVenueStore } from '../../stores/venueStore';
import VenueCard from '../venue/VenueCard';

export default function VenueList() {
  const filteredVenues = useVenueStore((state) => state.getFilteredVenues());

  return (
    <section className="px-4 py-4 pb-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">Discover Premium Venues</h3>
          <p className="text-sm text-gray-500 mt-1">{filteredVenues.length} venues available</p>
        </div>

        <div className="space-y-4">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}