import { create } from 'zustand';
import { venues } from '../data/mockVenues';

export const useVenueStore = create((set, get) => ({
  venues: venues,
  selectedLocation: 'All Locations',
  selectedPriceRange: { label: 'All Prices', min: 0, max: Infinity },
  selectedServiceStandard: { label: 'All Ratings', min: 0 },
  searchQuery: '',
  favorites: [],

  setLocation: (location) => set({ selectedLocation: location }),
  setPriceRange: (range) => set({ selectedPriceRange: range }),
  setServiceStandard: (standard) => set({ selectedServiceStandard: standard }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredVenues: () => {
    const { venues, selectedLocation, selectedPriceRange, selectedServiceStandard, searchQuery } = get();

    return venues.filter(v => {
      const locationMatch = selectedLocation === 'All Locations' || 
        v.area === selectedLocation || v.location.includes(selectedLocation);

      const priceMatch = v.pricePerHour >= selectedPriceRange.min && 
        v.pricePerHour <= selectedPriceRange.max;

      const ratingMatch = v.rating >= selectedServiceStandard.min;

      const searchMatch = !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return locationMatch && priceMatch && ratingMatch && searchMatch && v.status === 'active';
    });
  },

  toggleFavorite: (venueId) => {
    const { favorites } = get();
    if (favorites.includes(venueId)) {
      set({ favorites: favorites.filter(id => id !== venueId) });
    } else {
      set({ favorites: [...favorites, venueId] });
    }
  },

  isFavorite: (venueId) => get().favorites.includes(venueId),

  updateVenuePrice: (venueId, newPrice) => {
    set(state => ({
      venues: state.venues.map(v => 
        v.id === venueId ? { ...v, pricePerHour: newPrice, discount: calcDiscount(v.originalPrice, newPrice) } : v
      )
    }));
  },

  applyDiscount: (venueId, discountPercent) => {
    set(state => ({
      venues: state.venues.map(v => {
        if (v.id === venueId) {
          const newPrice = Math.round(v.originalPrice * (1 - discountPercent / 100));
          return { ...v, pricePerHour: newPrice, discount: discountPercent };
        }
        return v;
      })
    }));
  },

  removeDiscount: (venueId) => {
    set(state => ({
      venues: state.venues.map(v => 
        v.id === venueId ? { ...v, pricePerHour: v.originalPrice, discount: 0 } : v
      )
    }));
  },

  toggleAmenity: (venueId, amenityName) => {
    set(state => ({
      venues: state.venues.map(v => {
        if (v.id === venueId) {
          const amenities = v.amenities.map(a => 
            a.name === amenityName ? { ...a, available: !a.available } : a
          );
          return { ...v, amenities };
        }
        return v;
      })
    }));
  },

  addVenue: (venue) => set(state => ({ venues: [...state.venues, venue] })),

  removeVenue: (venueId) => set(state => ({ 
    venues: state.venues.map(v => v.id === venueId ? { ...v, status: 'inactive' } : v)
  })),

  restoreVenue: (venueId) => set(state => ({
    venues: state.venues.map(v => v.id === venueId ? { ...v, status: 'active' } : v)
  })),
}));

function calcDiscount(original, current) {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}