import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAdminStore } from '../../stores/adminStore'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useAdminStore((state) => state.login)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const success = login(username, password)
    if (success) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text mb-2">EventSpace Admin</h1>
          <p className="text-sm text-gray-500">Sign in to manage your venues</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 card-shadow space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="admin" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25">
            Sign In
          </button>

          <p className="text-xs text-gray-400 text-center">
            Default: admin / eventspace2026
          </p>
        </form>
      </div>
    </div>
  )
}