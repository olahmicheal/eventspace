import { useState } from 'react'
import { X, Banknote, Percent } from 'lucide-react'

export default function PaymentForm({ booking, onSubmit, onCancel }) {
  const [bankName, setBankName] = useState('First Bank of Nigeria')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [commissionPercent, setCommissionPercent] = useState(10) // Default 10%
  const [notes, setNotes] = useState('')

  const commissionAmount = Math.round(booking.totalAmount * (commissionPercent / 100))
  const finalAmount = booking.totalAmount + commissionAmount

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      bankName,
      accountName,
      accountNumber,
      commissionPercent,
      commissionAmount,
      finalAmount,
      notes,
      paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
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
            <strong>Base Amount:</strong> ₦{booking.totalAmount?.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <select
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commission ({commissionPercent}%)
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
              <span className="text-sm font-medium text-gray-900 w-16">
                ₦{commissionAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Amount:</span>
              <span className="font-medium">₦{booking.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Commission ({commissionPercent}%):</span>
              <span className="font-medium">₦{commissionAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-green-200">
              <span className="text-green-800">Total Due:</span>
              <span className="text-green-800">₦{finalAmount.toLocaleString()}</span>
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