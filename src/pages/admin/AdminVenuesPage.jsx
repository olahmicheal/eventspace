import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import { useVenueStore } from '../../stores/venueStore'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { formatPriceFull } from '../../lib/utils'

export default function AdminVenuesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminStore()
  const { venues, updateVenuePrice, applyDiscount, removeDiscount, toggleAmenity, removeVenue, restoreVenue } = useVenueStore()
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  const [discountInput, setDiscountInput] = useState('')

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handlePriceUpdate = (venueId) => {
    if (newPrice) {
      updateVenuePrice(venueId, parseInt(newPrice))
      setEditingPrice(null)
      setNewPrice('')
    }
  }

  const handleDiscount = (venueId) => {
    if (discountInput) {
      applyDiscount(venueId, parseInt(discountInput))
      setDiscountInput('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Manage Venues</h1>
            <button className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2">
              <Plus size={18} /> Add Venue
            </button>
          </div>

          <div className="bg-white rounded-xl card-shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Venue</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Price/Hr</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Discount</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {venues.map((venue) => (
                  <tr key={venue.id} className={venue.status === 'inactive' ? 'opacity-50' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={venue.images[0]} alt={venue.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{venue.name}</p>
                          <p className="text-xs text-gray-500">{venue.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingPrice === venue.id ? (
                        <div className="flex items-center gap-2">
                          <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-sm" placeholder="New price" />
                          <button onClick={() => handlePriceUpdate(venue.id)} className="text-green-600"><Check size={16} /></button>
                          <button onClick={() => setEditingPrice(null)} className="text-red-600"><X size={16} /></button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formatPriceFull(venue.pricePerHour)}</p>
                          {venue.discount > 0 && <p className="text-xs text-green-600">-{venue.discount}% off</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input type="number" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm" placeholder="%" />
                        <button onClick={() => handleDiscount(venue.id)} className="text-primary-600 text-sm font-medium">Apply</button>
                        {venue.discount > 0 && (
                          <button onClick={() => removeDiscount(venue.id)} className="text-red-600 text-sm">Remove</button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        venue.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {venue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingPrice(venue.id); setNewPrice(venue.pricePerHour.toString()); }}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"><Pencil size={16} /></button>
                        {venue.status === 'active' ? (
                          <button onClick={() => removeVenue(venue.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        ) : (
                          <button onClick={() => restoreVenue(venue.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">Restore</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Amenities</h3>
            <div className="space-y-4">
              {venues.filter(v => v.status === 'active').map((venue) => (
                <div key={venue.id} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{venue.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity) => (
                      <button
                        key={amenity.name}
                        onClick={() => toggleAmenity(venue.id, amenity.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          amenity.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-400 line-through'
                        }`}
                      >
                        {amenity.available ? '✓' : '✗'} {amenity.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}