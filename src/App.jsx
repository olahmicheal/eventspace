import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VenueDetailPage from './pages/VenueDetailPage'
import BookingPage from './pages/BookingPage'
import SuccessPage from './pages/SuccessPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminVenuesPage from './pages/admin/AdminVenuesPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/venue/:id" element={<VenueDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/venues" element={<AdminVenuesPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
      </Routes>
    </div>
  )
}

export default App