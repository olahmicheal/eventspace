import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Newspaper, Download } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function PressPage() {
  const navigate = useNavigate()

  const pressReleases = [
    { title: 'EventSpace Raises $2M Seed Round', date: 'June 2026', source: 'TechCrunch' },
    { title: 'Top 10 Event Tech Startups in Africa', date: 'May 2026', source: 'Disrupt Africa' },
    { title: 'How EventSpace is Transforming Lagos Event Industry', date: 'April 2026', source: 'Techpoint' },
  ]

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

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Press & Media</h1>
        <p className="text-sm text-gray-500 mb-6">News, press kits, and media resources.</p>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Newspaper size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Media Kit</h2>
              <p className="text-xs text-gray-500">Logos, brand assets, and facts</p>
            </div>
          </div>
          <button className="w-full py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2">
            <Download size={16} /> Download Press Kit
          </button>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Coverage</h2>
        <div className="space-y-3">
          {pressReleases.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.source} • {item.date}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">For press inquiries:</p>
          <a href="mailto:press@eventspace.ng" className="text-primary-600 font-medium">press@eventspace.ng</a>
        </div>
      </main>

      <Footer />
    </div>
  )
}