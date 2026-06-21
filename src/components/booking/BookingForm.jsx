import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, Check, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { eventTypes } from '../../data/mockVenues';
import { TRUST_BADGES } from '../../lib/constants';
import PricingCard from '../venue/PricingCard';

// Email helper — ONLY ONE COPY
const sendBookingEmail = async ({ to, bookingId, status, venueName, totalAmount, customerName }) => {
  console.log('Sending email with:', { to, bookingId, status, venueName, totalAmount, customerName })
  
  try {
    const response = await fetch('https://vppcxubyjgzfkkamrirh.supabase.co/functions/v1/hyper-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to,
        bookingId,
        status,
        venueName,
        totalAmount,
        customerName,
      }),
    })
    
    const result = await response.json()
    console.log('Email response:', result)
    
    if (!response.ok) {
      console.error('Email failed:', result)
    }
  } catch (err) {
    console.error('Email fetch error:', err)
  }
}

export default function BookingForm({ venue }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', eventType: '',
    eventDate: '', startTime: '', endTime: '',
    expectedGuests: '', specialRequests: '',
  });

  const [showEventType, setShowEventType] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours;
    };

    const start = parseTime(formData.startTime);
    const end = parseTime(formData.endTime);
    const hours = Math.max(end - start, venue.minimumHours);
    
    return venue.pricePerHour * hours;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const totalAmount = calculateTotal()

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          venue_id: venue.id,
          customer_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          event_type: formData.eventType,
          event_date: formData.eventDate,
          start_time: formData.startTime,
          end_time: formData.endTime,
          expected_guests: parseInt(formData.expectedGuests) || 0,
          total_amount: totalAmount,
          special_requests: formData.specialRequests,
          status: 'pending',
        })
        .select()

      if (error) throw error

      // Send pending email
      await sendBookingEmail({
        to: formData.email,
        bookingId: data[0].id,
        status: 'pending',
        venueName: venue.name,
        totalAmount,
        customerName: formData.fullName,
      })

      navigate('/success', { 
        state: { 
          bookingId: data[0].id,
          venueName: venue.name,
          totalAmount,
          eventDate: formData.eventDate,
          startTime: formData.startTime,
          endTime: formData.endTime
        } 
      })
    } catch (err) {
      console.error('Booking error:', err)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!venue) return null;

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
  ];

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 pb-24">
      <div className="max-w-lg mx-auto space-y-5">
        <PricingCard 
          price={venue.pricePerHour} 
          originalPrice={venue.originalPrice}
          discount={venue.discount}
          minimumHours={venue.minimumHours} 
          currency={venue.currency}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
          <input type="text" placeholder="John Doe" value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
          <input type="email" placeholder="john@example.com" value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
          <input type="tel" placeholder="080XXXXXXXX" value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Event Type</label>
          <button type="button" onClick={() => setShowEventType(!showEventType)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-left flex items-center justify-between">
            <span className={formData.eventType ? 'text-gray-900' : 'text-gray-400'}>
              {formData.eventType || 'Select event type'}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {showEventType && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 max-h-60 overflow-y-auto">
              {eventTypes.map((type) => (
                <button key={type} type="button" onClick={() => { handleChange('eventType', type); setShowEventType(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${formData.eventType === type ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}>
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Event Date</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Start Time</label>
            <button type="button" onClick={() => setShowStartTime(!showStartTime)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-left flex items-center justify-between">
              <span className={formData.startTime ? 'text-gray-900' : 'text-gray-400'}>{formData.startTime || 'Start'}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showStartTime && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 max-h-48 overflow-y-auto">
                {timeSlots.map((time) => (
                  <button key={time} type="button" onClick={() => { handleChange('startTime', time); setShowStartTime(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${formData.startTime === time ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}>
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-2">End Time</label>
            <button type="button" onClick={() => setShowEndTime(!showEndTime)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-left flex items-center justify-between">
              <span className={formData.endTime ? 'text-gray-900' : 'text-gray-400'}>{formData.endTime || 'End'}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showEndTime && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 max-h-48 overflow-y-auto">
                {timeSlots.map((time) => (
                  <button key={time} type="button" onClick={() => { handleChange('endTime', time); setShowEndTime(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${formData.endTime === time ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}>
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Expected Guests</label>
          <input type="number" placeholder={`Max ${venue.capacity}`} value={formData.expectedGuests}
            onChange={(e) => handleChange('expectedGuests', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" max={venue.capacity} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Special Requests <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea placeholder="Any special requirements?" value={formData.specialRequests}
            onChange={(e) => handleChange('specialRequests', e.target.value)} rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25 disabled:opacity-50">
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>Request to Book <span className="text-lg">→</span></>
          )}
        </button>

        <div className="space-y-3 pt-2">
          {TRUST_BADGES.map((badge, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                {badge.icon === 'check' ? <Check size={12} className="text-green-600" strokeWidth={3} /> : <Shield size={12} className="text-green-600" strokeWidth={2} />}
              </div>
              <span className="text-sm text-gray-600">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}