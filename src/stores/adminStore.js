import { create } from 'zustand';
import { mockBookings, mockComplaints, adminCredentials } from '../data/mockVenues';

export const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  adminUser: null,
  bookings: mockBookings,
  complaints: mockComplaints,

  login: (username, password) => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      set({ isAuthenticated: true, adminUser: { username } });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false, adminUser: null }),

  updateBookingStatus: (bookingId, status) => {
    set(state => ({
      bookings: state.bookings.map(b => 
        b.id === bookingId ? { ...b, status } : b
      )
    }));
  },

  updateComplaintStatus: (complaintId, status) => {
    set(state => ({
      complaints: state.complaints.map(c => 
        c.id === complaintId ? { ...c, status } : c
      )
    }));
  },

  getStats: () => {
    const { bookings, complaints } = get();
    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.totalAmount : 0), 0),
      openComplaints: complaints.filter(c => c.status === 'open').length,
      resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
    };
  },
}));