import { useState } from 'react'
import { X, Banknote } from 'lucide-react'

export default function PaymentForm({ booking, onSubmit, onCancel }) {
  const [bankName, setBankName] = useState('First Bank of Nigeria')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [commissionPercent, setCommissionPercent] = useState(10)
  const [notes, setNotes] = useState('')

  // Commission is calculated from base amount for INTERNAL tracking only
  const commissionAmount = Math.round(booking.totalAmount * (commissionPercent / 100))
  
  // User pays ONLY the base amount (venue price)
  const userPays = booking.totalAmount

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      bankName,
      accountName,
      accountNumber,
      commissionPercent,      // For internal tracking
      commissionAmount,       // For internal tracking
      baseAmount: booking.totalAmount,  // What user actually pays
      notes,
      paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Booking:</strong> {booking.venueName}<br />
            <strong>Customer:</strong> {booking.customerName}<br />
            <strong>Amount to Collect:</strong> ₦{userPays?.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
            <select
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option>First Bank of Nigeria</option>
              <option>GTBank</option>
              <option>Access Bank</option>
              <option>Zenith Bank</option>
              <option>UBA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
            <input
              required
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="Account holder name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
            <input
              required
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="10 digit account number"
              maxLength={10}
            />
          </div>

          {/* Internal Commission Tracking - Admin Only */}
          <div className="border-t border-dashed border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Internal Commission ({commissionPercent}%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="25"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-20">
                ₦{commissionAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              For internal revenue tracking only. Not added to customer payment.
            </p>
          </div>

          {/* What user actually pays */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customer Pays:</span>
              <span className="font-bold text-green-800">₦{userPays.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
              placeholder="Additional payment instructions..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl"
            >
              Send Payment Email
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}