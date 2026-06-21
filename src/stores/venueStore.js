import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useVenueStore = create((set, get) => ({
  venues: [],
  selectedLocation: 'All Locations',
  selectedPriceRange: { label: 'All Prices', min: 0, max: Infinity },
  selectedServiceStandard: { label: 'All Ratings', min: 0 },
  searchQuery: '',
  favorites: [],
  isLoading: false,
  error: null,

  // Fetch venues from Supabase
  fetchVenues: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      // Transform data to match frontend shape
      const formattedVenues = data.map(v => ({
        id: v.id,
        name: v.name,
        location: v.location,
        area: v.area,
        capacity: v.capacity,
        pricePerHour: v.price_per_hour,
        originalPrice: v.original_price,
        discount: v.discount,
        currency: v.currency,
        minimumHours: v.minimum_hours,
        rating: v.rating,
        reviewCount: v.review_count,
        description: v.description,
        images: v.images,
        amenities: v.amenities,
        perfectFor: v.perfect_for,
        houseRules: v.house_rules,
        tags: v.tags,
        status: v.status,
      }));

      set({ venues: formattedVenues, isLoading: false });
    } catch (err) {
      console.error('Error fetching venues:', err);
      set({ error: err.message, isLoading: false });
    }
  },

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

  // Admin: Update venue price
  updateVenuePrice: async (venueId, newPrice) => {
    try {
      const venue = get().venues.find(v => v.id === venueId);
      const discount = calcDiscount(venue.originalPrice, newPrice);

      const { error } = await supabase
        .from('venues')
        .update({ price_per_hour: newPrice, discount })
        .eq('id', venueId);

      if (error) throw error;

      set(state => ({
        venues: state.venues.map(v =>
          v.id === venueId ? { ...v, pricePerHour: newPrice, discount } : v
        )
      }));
    } catch (err) {
      console.error('Error updating price:', err);
    }
  },

  // Admin: Apply discount
  applyDiscount: async (venueId, discountPercent) => {
    try {
      const venue = get().venues.find(v => v.id === venueId);
      const newPrice = Math.round(venue.originalPrice * (1 - discountPercent / 100));

      const { error } = await supabase
        .from('venues')
        .update({ price_per_hour: newPrice, discount: discountPercent })
        .eq('id', venueId);

      if (error) throw error;

      set(state => ({
        venues: state.venues.map(v => {
          if (v.id === venueId) {
            return { ...v, pricePerHour: newPrice, discount: discountPercent };
          }
          return v;
        })
      }));
    } catch (err) {
      console.error('Error applying discount:', err);
    }
  },

  // Admin: Remove discount
  removeDiscount: async (venueId) => {
    try {
      const venue = get().venues.find(v => v.id === venueId);

      const { error } = await supabase
        .from('venues')
        .update({ price_per_hour: venue.originalPrice, discount: 0 })
        .eq('id', venueId);

      if (error) throw error;

      set(state => ({
        venues: state.venues.map(v =>
          v.id === venueId ? { ...v, pricePerHour: v.originalPrice, discount: 0 } : v
        )
      }));
    } catch (err) {
      console.error('Error removing discount:', err);
    }
  },

  // Admin: Toggle amenity
  toggleAmenity: async (venueId, amenityName) => {
    try {
      const venue = get().venues.find(v => v.id === venueId);
      const updatedAmenities = venue.amenities.map(a =>
        a.name === amenityName ? { ...a, available: !a.available } : a
      );

      const { error } = await supabase
        .from('venues')
        .update({ amenities: updatedAmenities })
        .eq('id', venueId);

      if (error) throw error;

      set(state => ({
        venues: state.venues.map(v => {
          if (v.id === venueId) {
            return { ...v, amenities: updatedAmenities };
          }
          return v;
        })
      }));
    } catch (err) {
      console.error('Error toggling amenity:', err);
    }
  },

  // Admin: Add venue
  addVenue: async (venue) => {
    try {
      const dbVenue = {
        name: venue.name,
        location: venue.location,
        area: venue.area,
        capacity: venue.capacity,
        price_per_hour: venue.pricePerHour,
        original_price: venue.originalPrice || venue.pricePerHour,
        discount: venue.discount || 0,
        currency: venue.currency || 'NGN',
        minimum_hours: venue.minimumHours || 4,
        rating: venue.rating || 5.0,
        review_count: venue.reviewCount || 0,
        description: venue.description,
        images: venue.images || [],
        amenities: venue.amenities || [],
        perfect_for: venue.perfectFor || [],
        house_rules: venue.houseRules || [],
        tags: venue.tags || [],
        status: 'active',
      };

      const { data, error } = await supabase
        .from('venues')
        .insert(dbVenue)
        .select()
        .single();

      if (error) throw error;

      const formattedVenue = {
        id: data.id,
        name: data.name,
        location: data.location,
        area: data.area,
        capacity: data.capacity,
        pricePerHour: data.price_per_hour,
        originalPrice: data.original_price,
        discount: data.discount,
        currency: data.currency,
        minimumHours: data.minimum_hours,
        rating: data.rating,
        reviewCount: data.review_count,
        description: data.description,
        images: data.images,
        amenities: data.amenities,
        perfectFor: data.perfect_for,
        houseRules: data.house_rules,
        tags: data.tags,
        status: data.status,
      };

      set(state => ({ venues: [...state.venues, formattedVenue] }));
      return formattedVenue;
    } catch (err) {
      console.error('Error adding venue:', err);
      throw err;
    }
  },

  // Admin: Remove venue (soft delete)
  removeVenue: async (venueId) => {
    try {
      const { error } = await supabase
        .from('venues')
        .update({ status: 'inactive' })
        .eq('id', venueId);

      if (error) throw error;

      set(state => ({
        venues: state.venues.map(v => v.id === venueId ? { ...v, status: 'inactive' } : v)
      }));
    } catch (err) {
      console.error('Error removing venue:', err);
    }
  },

  // Admin: Restore venue
  restoreVenue: async (venueId) => {
    try {
      const { error } = await supabase
        .from('venues')
        .update({ status: 'active' })
        .eq('id', venueId);

      if (error) throw error;

      set(state => ({
        venues: state.venues.map(v => v.id === venueId ? { ...v, status: 'active' } : v)
      }));
    } catch (err) {
      console.error('Error restoring venue:', err);
    }
  },
}));

function calcDiscount(original, current) {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}