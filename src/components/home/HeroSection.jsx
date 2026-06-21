import { MapPin, ChevronDown, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useVenueStore } from '../../stores/venueStore';
import { locations } from '../../data/mockVenues';

export default function HeroSection() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { selectedLocation, setLocation, searchQuery, setSearchQuery } = useVenueStore();

  return (
    <section className="px-4 pt-8 pb-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
          Find Your Perfect
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-accent-pink bg-clip-text text-transparent">
            Event Space
          </span>{' '}
          in
          <br />
          Lagos
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          Browse, compare, and book stunning venues for your next celebration
        </p>
      </div>

      {/* Unified Search Bar */}
      <div className="relative max-w-sm mx-auto">
        <div className="flex items-center bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          {/* Location Dropdown */}
          <div className="flex items-center gap-2 pl-4 pr-2 py-3 border-r border-gray-100">
            <MapPin size={18} className="text-primary-500 flex-shrink-0" />
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-sm text-gray-700 font-medium text-left flex items-center gap-1 whitespace-nowrap"
            >
              {selectedLocation === 'All Locations' ? 'All' : selectedLocation}
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Text Search Input */}
          <div className="flex-1 flex items-center px-3 py-3">
            <input
              type="text"
              placeholder="Search venues, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mr-2">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-3.5 rounded-r-2xl hover:opacity-90 transition-opacity">
            <Search size={20} />
          </button>
        </div>

        {/* Location Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden z-20 w-48">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocation(loc);
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                  selectedLocation === loc ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <ChevronDown size={20} className="text-gray-300 animate-bounce" />
      </div>
    </section>
  );
}