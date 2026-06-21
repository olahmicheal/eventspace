import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  adminUser: null,
  bookings: [],
  complaints: [],
  isLoading: false,
  error: null,

  // Check existing session on load
  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        set({ isAuthenticated: true, adminUser: { email: session.user.email } });
        get().fetchBookings();
        get().fetchComplaints();
      }
    }
  },

  // Login with Supabase Auth
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Admin access only');
      }

      set({ isAuthenticated: true, adminUser: { email: data.user.email }, isLoading: false });
      get().fetchBookings();
      get().fetchComplaints();
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, adminUser: null, bookings: [], complaints: [] });
  },

  // Fetch bookings from Supabase
  fetchBookings: async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, venues(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBookings = data.map(b => ({
        id: b.id,
        venueId: b.venue_id,
        venueName: b.venues?.name || b.venue_name,
        customerName: b.customer_name,
        email: b.email,
        phone: b.phone,
        eventType: b.event_type,
        eventDate: b.event_date,
        startTime: b.start_time,
        endTime: b.end_time,
        expectedGuests: b.expected_guests,
        totalAmount: b.total_amount,
        status: b.status,
        specialRequests: b.special_requests,
        createdAt: b.created_at,
      }));

      set({ bookings: formattedBookings });
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  },

  // Update booking status
 updateBookingStatus: async (bookingId, status) => {
  try {
    // First, get booking details for the email
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, venues(name)')
      .eq('id', bookingId)
      .single()

    // Update status in database
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (error) throw error

    // Send email notification
    await fetch('https://vppcxubyjgzfkkamrirh.supabase.co/functions/v1/hyper-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to: booking.email,
        bookingId: booking.id,
        status,
        venueName: booking.venues?.name || booking.venue_name,
        totalAmount: booking.total_amount,
        customerName: booking.customer_name,
      }),
    })

    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === bookingId ? { ...b, status } : b
      )
    }))
  } catch (err) {
    console.error('Error updating booking:', err)
  }
},

  // Fetch complaints from Supabase
  fetchComplaints: async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedComplaints = data.map(c => ({
        id: c.id,
        customerName: c.customer_name,
        email: c.email,
        phone: c.phone,
        venueName: c.venue_name,
        subject: c.subject,
        message: c.message,
        status: c.status,
        createdAt: c.created_at,
        priority: c.priority,
      }));

      set({ complaints: formattedComplaints });
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  },

  // Update complaint status
  updateComplaintStatus: async (complaintId, status) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status })
        .eq('id', complaintId);

      if (error) throw error;

      set(state => ({
        complaints: state.complaints.map(c =>
          c.id === complaintId ? { ...c, status } : c
        )
      }));
    } catch (err) {
      console.error('Error updating complaint:', err);
    }
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