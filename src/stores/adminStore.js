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

 // Update booking status with payment details and email
updateBookingStatus: async (bookingId, status, paymentDetails = null) => {
  try {
    // Get full booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, venues(name, location, area, price_per_hour)')
      .eq('id', bookingId)
      .single()

    if (fetchError) throw fetchError

    // Build update data
    const updateData = { status }
    
    if (paymentDetails) {
      updateData.payment_details = paymentDetails
      updateData.final_amount = paymentDetails.finalAmount
      updateData.commission_amount = paymentDetails.commissionAmount
    }
    
    if (status === 'completed') {
      updateData.payment_date = new Date().toISOString()
      updateData.cancellation_deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    }

    // Update in database
    const { error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)

    if (updateError) throw updateError

    // Build email payload
    const emailPayload = {
      to: booking.email,
      bookingId: booking.id,
      status,
      venueName: booking.venues?.name || booking.venue_name,
      totalAmount: booking.total_amount,
      customerName: booking.customer_name,
      eventDate: booking.event_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      duration: booking.end_time && booking.start_time ? 
        (parseInt(booking.end_time) - parseInt(booking.start_time)) : 4,
    }

    // Add payment details for confirmed email
    if (status === 'confirmed' && paymentDetails) {
      emailPayload.bankName = paymentDetails.bankName
      emailPayload.accountName = paymentDetails.accountName
      emailPayload.accountNumber = paymentDetails.accountNumber
      emailPayload.commissionAmount = paymentDetails.commissionAmount
      emailPayload.finalAmount = paymentDetails.finalAmount
      emailPayload.paymentDeadline = paymentDetails.paymentDeadline
    }

    // Add receipt details for completed email
    if (status === 'completed') {
      emailPayload.finalAmount = booking.final_amount || booking.total_amount
      emailPayload.paymentDate = new Date().toISOString()
      emailPayload.cancellationDeadline = updateData.cancellation_deadline
    }

    // Add recommendations for rejected email
    if (status === 'cancelled') {
      const { data: nearbyVenues } = await supabase
        .from('venues')
        .select('id, name, location, area, price_per_hour, images, rating')
        .eq('status', 'active')
        .neq('id', booking.venue_id)
        .limit(4)

      if (nearbyVenues) {
        emailPayload.recommendedVenues = nearbyVenues.map(v => ({
          id: v.id,
          name: v.name,
          location: v.location,
          pricePerHour: v.price_per_hour,
          images: v.images,
          rating: v.rating,
        }))
      }
    }

    // Send email via Edge Function
    await fetch('https://vppcxubyjgzfkkamrirh.supabase.co/functions/v1/hyper-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    })

    // Update local state
    set(state => ({
      bookings: state.bookings.map(b =>
        b.id === bookingId ? { ...b, status, ...updateData } : b
      )
    }))

    return true
  } catch (err) {
    console.error('Error updating booking:', err)
    alert('Failed to update booking: ' + err.message)
    return false
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