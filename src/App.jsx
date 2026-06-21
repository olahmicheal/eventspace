import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAdminStore } from './stores/adminStore'
import HomePage from './pages/HomePage'
import VenueDetailPage from './pages/VenueDetailPage'
import BookingPage from './pages/BookingPage'
import SuccessPage from './pages/SuccessPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminVenuesPage from './pages/admin/AdminVenuesPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage'

import AboutPage from './pages/AboutPage'
import HelpPage from './pages/HelpPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import SafetyPage from './pages/SafetyPage'
import CareersPage from './pages/CareersPage'
import PressPage from './pages/PressPage'

// Protected admin route wrapper
function AdminRoute({ children }) {
  const { isAuthenticated } = useAdminStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}

function App() {
  const { checkSession } = useAdminStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/venue/:id" element={<VenueDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        
         {/* Footer Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        <Route path="/admin/venues" element={
          <AdminRoute>
            <AdminVenuesPage />
          </AdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminRoute>
            <AdminBookingsPage />
          </AdminRoute>
        } />
        <Route path="/admin/complaints" element={
          <AdminRoute>
            <AdminComplaintsPage />
          </AdminRoute>
        } />
      </Routes>
    </div>
  )
}

export default App