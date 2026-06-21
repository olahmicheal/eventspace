import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, bookingId, status, venueName, totalAmount, customerName } = await req.json()

    let subject = ''
    let html = ''

    // Email 1: Booking Pending
    if (status === 'pending') {
      subject = `Booking Request Received - ${venueName}`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Hello ${customerName},</h2>
          <p>Your booking request has been received!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Venue:</strong> ${venueName}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Amount:</strong> ₦${totalAmount?.toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #f59e0b;">⏳ Pending</span></p>
          </div>
          <p>We're reviewing your request and will get back to you shortly.</p>
          <p style="color: #6b7280; font-size: 12px;">EventSpace Team</p>
        </div>
      `
    }

    // Email 2: Booking Confirmed (with payment details)
    if (status === 'confirmed') {
      subject = `Booking Confirmed - ${venueName}`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Great News, ${customerName}!</h2>
          <p>Your booking has been <strong>CONFIRMED</strong>! 🎉</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Venue:</strong> ${venueName}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Amount Due:</strong> ₦${totalAmount?.toLocaleString()}</p>
          </div>
          <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0; border: 2px solid #10b981;">
            <h3 style="color: #059669; margin-top: 0;">💳 Payment Details</h3>
            <p><strong>Bank:</strong> First Bank of Nigeria</p>
            <p><strong>Account Name:</strong> EventSpace Nigeria Ltd</p>
            <p><strong>Account Number:</strong> 0123456789</p>
            <p><strong>Amount:</strong> ₦${totalAmount?.toLocaleString()}</p>
            <p style="font-size: 12px; color: #6b7280;">Please include your Booking ID as reference.</p>
          </div>
          <p>Once payment is confirmed, you'll receive a final confirmation.</p>
          <p style="color: #6b7280; font-size: 12px;">EventSpace Team</p>
        </div>
      `
    }

    // Email 3: Payment Successful / Booking Complete
    if (status === 'completed') {
      subject = `Booking Complete - ${venueName}`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Payment Confirmed, ${customerName}!</h2>
          <p>Your booking is now <strong>COMPLETE</strong>! ✅</p>
          <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Venue:</strong> ${venueName}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Amount Paid:</strong> ₦${totalAmount?.toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #10b981;">✅ Complete</span></p>
          </div>
          <p>The venue has been notified and will contact you with final details.</p>
          <p>Thank you for choosing EventSpace!</p>
          <p style="color: #6b7280; font-size: 12px;">EventSpace Team</p>
        </div>
      `
    }

    // Email: Booking Rejected
    if (status === 'cancelled') {
      subject = `Booking Update - ${venueName}`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Hello ${customerName},</h2>
          <p>We regret to inform you that your booking request could not be accommodated.</p>
          <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Venue:</strong> ${venueName}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Status:</strong> <span style="color: #ef4444;">❌ Not Available</span></p>
          </div>
          <p>Please try another date or venue. We're happy to help you find the perfect space.</p>
          <p style="color: #6b7280; font-size: 12px;">EventSpace Team</p>
        </div>
      `
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'EventSpace <bookings@eventspace.ng>',
        to: [to],
        subject,
        html,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})