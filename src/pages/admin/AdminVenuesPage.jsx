import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Plus, Check, X, Upload, Link, ImageIcon } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'
import { useVenueStore } from '../../stores/venueStore'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { formatPriceFull } from '../../lib/utils'
import { supabase } from '../../lib/supabase'

// Pre-defined Lagos locations
const LAGOS_LOCATIONS = [
  { area: 'Lekki', locations: ['Lekki Phase 1', 'Lekki Phase 2', 'Lekki-Epe Expressway', 'Chevron Drive', 'Jakande'] },
  { area: 'Victoria Island', locations: ['Victoria Island', 'Adeola Odeku', 'Bishop Aboyade Cole', 'Akin Adesola'] },
  { area: 'Ikoyi', locations: ['Ikoyi', 'Falomo', 'Gerrard Road', 'Alexander Road', 'Dolphin Estate'] },
  { area: 'Ikeja', locations: ['Ikeja GRA', 'Opebi', 'Allen Avenue', 'Maryland', 'Ogba', 'Magodo'] },
  { area: 'Yaba', locations: ['Yaba', 'Sabo', 'Tejuosho', 'Ojuelegba'] },
  { area: 'Surulere', locations: ['Surulere', 'Aguda', 'Bode Thomas', 'Ojuelegba'] },
  { area: 'Ikorodu', locations: ['Ikorodu Town', 'Ikorodu Garage', 'Agric'] },
  { area: 'Festac', locations: ['Festac Town', 'Amuwo Odofin', 'Mile 2'] },
  { area: 'Ajah', locations: ['Ajah', 'Sangotedo', 'Abraham Adesanya', 'Badore'] },
  { area: 'Gbagada', locations: ['Gbagada', 'Anthony', 'Maryland'] },
  { area: 'Oshodi', locations: ['Oshodi', 'Mafoluku', 'Ajao Estate'] },
  { area: 'Apapa', locations: ['Apapa', 'Tin Can', 'Kirikiri'] },
]

// Pre-defined amenities with icons
const PREDEFINED_AMENITIES = [
  { name: 'Parking', icon: 'car' },
  { name: 'Valet Parking', icon: 'car' },
  { name: 'WiFi', icon: 'wifi' },
  { name: 'Sound System', icon: 'music' },
  { name: 'Premium Sound System', icon: 'music' },
  { name: 'Catering Kitchen', icon: 'utensils' },
  { name: 'Outdoor Kitchen', icon: 'utensils' },
  { name: 'AC', icon: 'snowflake' },
  { name: 'Fans', icon: 'wind' },
  { name: 'Stage', icon: 'monitor' },
  { name: 'Grand Stage', icon: 'monitor' },
  { name: 'Projector', icon: 'monitor' },
  { name: 'Bridal Suite', icon: 'bed' },
  { name: 'VIP Lounge', icon: 'crown' },
  { name: 'Security', icon: 'shield' },
  { name: '24hr Security', icon: 'shield' },
  { name: 'Generator', icon: 'zap' },
  { name: 'Industrial Generator', icon: 'zap' },
  { name: 'Garden', icon: 'sun' },
  { name: 'Landscaped Garden', icon: 'sun' },
  { name: 'Pool Area', icon: 'waves' },
  { name: 'Bar Setup', icon: 'wine' },
  { name: 'DJ Booth', icon: 'headphones' },
  { name: 'City View', icon: 'eye' },
  { name: 'Garden View', icon: 'eye' },
  { name: 'Outdoor Seating', icon: 'sun' },
  { name: 'Conference Room', icon: 'users' },
]

// Pre-defined event types for "Perfect For"
const PERFECT_FOR_OPTIONS = [
  'Weddings', 'Corporate Events', 'Birthday Parties', 'Conferences',
  'Seminars', 'Gala Dinners', 'Outdoor Events', 'Cocktail Parties',
  'Garden Parties', 'Large Gatherings', 'Intimate Gatherings', 'Product Launches'
]

// Pre-defined house rules
const HOUSE_RULES_OPTIONS = [
  'No smoking indoors',
  'No smoking in garden areas',
  'Music ends at 10 PM',
  'Music ends at 11 PM',
  'Music ends at 12 AM',
  'Outside decoration allowed',
  'Outside decoration allowed with approval',
  'Minimum 4-hour booking',
  'Minimum 6-hour booking',
  'No outside catering',
  'No confetti or glitter',
  'Security deposit required',
]

export default function AdminVenuesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAdminStore()
  const { venues, fetchVenues, updateVenuePrice, applyDiscount, removeDiscount, toggleAmenity, removeVenue, restoreVenue, addVenue } = useVenueStore()
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  const [discountInput, setDiscountInput] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // New venue form state
  const [newVenue, setNewVenue] = useState({
    name: '',
    location: '',
    area: '',
    capacity: '',
    pricePerHour: '',
    description: '',
    images: [],
    imageUrls: [''],
    selectedAmenities: [],
    perfectFor: [],
    houseRules: [],
    tags: ['']
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login')
    fetchVenues()
  }, [isAuthenticated, navigate, fetchVenues])

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

  // Toggle amenity selection
  const toggleAmenitySelection = (amenity) => {
    setNewVenue(prev => {
      const exists = prev.selectedAmenities.find(a => a.name === amenity.name)
      if (exists) {
        return { ...prev, selectedAmenities: prev.selectedAmenities.filter(a => a.name !== amenity.name) }
      }
      return { ...prev, selectedAmenities: [...prev.selectedAmenities, { ...amenity, available: true }] }
    })
  }

  // Toggle perfect for selection
  const togglePerfectFor = (option) => {
    setNewVenue(prev => {
      if (prev.perfectFor.includes(option)) {
        return { ...prev, perfectFor: prev.perfectFor.filter(p => p !== option) }
      }
      return { ...prev, perfectFor: [...prev.perfectFor, option] }
    })
  }

  // Toggle house rule selection
  const toggleHouseRule = (rule) => {
    setNewVenue(prev => {
      if (prev.houseRules.includes(rule)) {
        return { ...prev, houseRules: prev.houseRules.filter(r => r !== rule) }
      }
      return { ...prev, houseRules: [...prev.houseRules, rule] }
    })
  }

  // Handle area selection
  const handleAreaChange = (area) => {
    setNewVenue(prev => ({ ...prev, area, location: '' }))
  }

  // Handle location selection
  const handleLocationChange = (location) => {
    setNewVenue(prev => ({ ...prev, location }))
  }

  // Add image URL field
  const addImageUrlField = () => {
    setNewVenue(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }))
  }

  // Update image URL
  const updateImageUrl = (index, value) => {
    const newUrls = [...newVenue.imageUrls]
    newUrls[index] = value
    setNewVenue(prev => ({ ...prev, imageUrls: newUrls }))
  }

  // Remove image URL
  const removeImageUrl = (index) => {
    setNewVenue(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  // Handle file upload to Supabase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `venue-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('venues')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('venues')
        .getPublicUrl(filePath)

      setNewVenue(prev => ({
        ...prev,
        images: [...prev.images, publicUrl]
      }))
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload image: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  // Remove uploaded image
  const removeUploadedImage = (index) => {
    setNewVenue(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddVenue = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine uploaded images and URL images
      const allImages = [
        ...newVenue.images,
        ...newVenue.imageUrls.filter(url => url.trim() !== '')
      ]

      if (allImages.length === 0) {
        alert('Please add at least one image')
        setIsSubmitting(false)
        return
      }

      const venueData = {
        name: newVenue.name,
        location: newVenue.location,
        area: newVenue.area,
        capacity: parseInt(newVenue.capacity),
        pricePerHour: parseInt(newVenue.pricePerHour),
        originalPrice: parseInt(newVenue.pricePerHour),
        description: newVenue.description,
        images: allImages,
        amenities: newVenue.selectedAmenities,
        perfectFor: newVenue.perfectFor,
        houseRules: newVenue.houseRules,
        tags: newVenue.selectedAmenities.map(a => a.name),
      }

      await addVenue(venueData)
      setShowAddModal(false)
      resetForm()
    } catch (err) {
      alert('Failed to add venue: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setNewVenue({
      name: '',
      location: '',
      area: '',
      capacity: '',
      pricePerHour: '',
      description: '',
      images: [],
      imageUrls: [''],
      selectedAmenities: [],
      perfectFor: [],
      houseRules: [],
      tags: ['']
    })
  }

  // Get locations for selected area
  const selectedAreaLocations = LAGOS_LOCATIONS.find(l => l.area === newVenue.area)?.locations || []

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Manage Venues</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-600 transition-all"
            >
              <Plus size={18} /> Add Venue
            </button>
          </div>

          {/* Add Venue Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
                  <h2 className="text-xl font-bold text-gray-900">Add New Venue</h2>
                  <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleAddVenue} className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
                      <input
                        required
                        type="text"
                        value={newVenue.name}
                        onChange={(e) => setNewVenue(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Azure Gardens Event Center"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                        <select
                          required
                          value={newVenue.area}
                          onChange={(e) => handleAreaChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select area</option>
                          {LAGOS_LOCATIONS.map(loc => (
                            <option key={loc.area} value={loc.area}>{loc.area}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                        <select
                          required
                          value={newVenue.location}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          disabled={!newVenue.area}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">{newVenue.area ? 'Select location' : 'Select area first'}</option>
                          {selectedAreaLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                        <input
                          required
                          type="number"
                          value={newVenue.capacity}
                          onChange={(e) => setNewVenue(prev => ({ ...prev, capacity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour (₦) *</label>
                        <input
                          required
                          type="number"
                          value={newVenue.pricePerHour}
                          onChange={(e) => setNewVenue(prev => ({ ...prev, pricePerHour: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 150000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        required
                        value={newVenue.description}
                        onChange={(e) => setNewVenue(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        placeholder="Describe the venue..."
                      />
                    </div>
                  </div>

                  {/* Images Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Images</h3>
                    
                    {/* Upload from device */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload from Device</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {uploadingImage ? (
                          <>
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={20} />
                            Click to upload images
                          </>
                        )}
                      </button>
                    </div>

                    {/* Uploaded images preview */}
                    {newVenue.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newVenue.images.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(i)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Image URLs */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Or Add Image URLs</label>
                      {newVenue.imageUrls.map((url, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <div className="flex-1 relative">
                            <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => updateImageUrl(i, e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          {newVenue.imageUrls.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageUrl(i)}
                              className="px-2 text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addImageUrlField} className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <Plus size={14} /> Add another URL
                      </button>
                    </div>
                  </div>

                  {/* Amenities - Click to toggle */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Amenities <span className="text-gray-400 font-normal normal-case">(Click to select)</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_AMENITIES.map((amenity) => {
                        const isSelected = newVenue.selectedAmenities.find(a => a.name === amenity.name)
                        return (
                          <button
                            key={amenity.name}
                            type="button"
                            onClick={() => toggleAmenitySelection(amenity)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {isSelected && <Check size={12} className="inline mr-1" />}
                            {amenity.name}
                          </button>
                        )
                      })}
                    </div>
                    {newVenue.selectedAmenities.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {newVenue.selectedAmenities.length} amenity{newVenue.selectedAmenities.length !== 1 ? 'ies' : 'y'} selected
                      </p>
                    )}
                  </div>

                  {/* Perfect For - Click to toggle */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Perfect For <span className="text-gray-400 font-normal normal-case">(Click to select)</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PERFECT_FOR_OPTIONS.map((option) => {
                        const isSelected = newVenue.perfectFor.includes(option)
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => togglePerfectFor(option)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {isSelected && <Check size={12} className="inline mr-1" />}
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* House Rules - Click to toggle */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      House Rules <span className="text-gray-400 font-normal normal-case">(Click to select)</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {HOUSE_RULES_OPTIONS.map((rule) => {
                        const isSelected = newVenue.houseRules.includes(rule)
                        return (
                          <button
                            key={rule}
                            type="button"
                            onClick={() => toggleHouseRule(rule)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {isSelected && <Check size={12} className="inline mr-1" />}
                            {rule}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white pb-2">
                    <button
                      type="button"
                      onClick={() => { setShowAddModal(false); resetForm(); }}
                      className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Venue'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Venues Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                        <img src={venue.images?.[0]} alt={venue.name} className="w-12 h-12 rounded-lg object-cover" />
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
                        <button onClick={() => handleDiscount(venue.id)} className="text-blue-600 text-sm font-medium">Apply</button>
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
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
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

          {/* Amenities Section */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Amenities</h3>
            <div className="space-y-4">
              {venues.filter(v => v.status === 'active').map((venue) => (
                <div key={venue.id} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{venue.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities?.map((amenity) => (
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