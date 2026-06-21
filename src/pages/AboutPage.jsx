import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Users, Target, Heart } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About EventSpace</h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          EventSpace is Nigeria's premier platform for discovering and booking the perfect event venues. 
          From elegant ballrooms to rooftop lounges, we connect you with Lagos' finest event spaces.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Building2 size={24} className="text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">50+ Venues</h3>
            <p className="text-xs text-gray-500">Premium spaces across Lagos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Users size={24} className="text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">1,000+ Events</h3>
            <p className="text-xs text-gray-500">Successfully hosted</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Target size={24} className="text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Our Mission</h3>
            <p className="text-xs text-gray-500">Making events seamless</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Heart size={24} className="text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Trusted</h3>
            <p className="text-xs text-gray-500">By thousands of clients</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Our Story</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Founded in 2024, EventSpace was born from a simple idea: finding the perfect venue 
            shouldn't be stressful. We've partnered with Lagos' most prestigious venues to bring 
            you a curated selection of spaces for every occasion.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}