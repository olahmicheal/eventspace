import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Tag, Star } from 'lucide-react';
import { useVenueStore } from '../../stores/venueStore';
import { locations, priceRanges, serviceStandards } from '../../data/mockVenues';

export default function SearchFilters() {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    selectedLocation, setLocation,
    selectedPriceRange, setPriceRange,
    selectedServiceStandard, setServiceStandard,
    searchQuery, setSearchQuery
  } = useVenueStore();

  return (
    <div className="px-4 py-3">
      <div className="max-w-lg mx-auto">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center bg-white rounded-xl border border-gray-200 px-3 py-2.5">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search venues, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="ml-2">
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-gray-200 text-gray-500'
            }`}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedLocation !== 'All Locations' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
              <MapPin size={12} /> {selectedLocation}
              <button onClick={() => setLocation('All Locations')}><X size={12} /></button>
            </span>
          )}
          {selectedPriceRange.label !== 'All Prices' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
              <Tag size={12} /> {selectedPriceRange.label}
              <button onClick={() => setPriceRange(priceRanges[0])}><X size={12} /></button>
            </span>
          )}
          {selectedServiceStandard.label !== 'All Ratings' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
              <Star size={12} /> {selectedServiceStandard.label}
              <button onClick={() => setServiceStandard(serviceStandards[0])}><X size={12} /></button>
            </span>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Location</label>
              <div className="flex flex-wrap gap-2">
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedLocation === loc
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Price Range</label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map(range => (
                  <button
                    key={range.label}
                    onClick={() => setPriceRange(range)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedPriceRange.label === range.label
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Standard */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Service Standard</label>
              <div className="flex flex-wrap gap-2">
                {serviceStandards.map(std => (
                  <button
                    key={std.label}
                    onClick={() => setServiceStandard(std)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedServiceStandard.label === std.label
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {std.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}