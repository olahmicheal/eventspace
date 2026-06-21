import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, Rocket, Users } from 'lucide-react'
import Footer from '../components/layout/Footer'

export default function CareersPage() {
  const navigate = useNavigate()

  const openings = [
    { title: 'Frontend Developer', type: 'Full-time', location: 'Lagos / Remote' },
    { title: 'Customer Support Lead', type: 'Full-time', location: 'Lagos' },
    { title: 'Venue Partnership Manager', type: 'Full-time', location: 'Lagos' },
    { title: 'Marketing Specialist', type: 'Contract', location: 'Remote' },
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Careers at EventSpace</h1>
        <p className="text-sm text-gray-500 mb-6">Join our growing team.</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Briefcase size={20} className="text-primary-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">4</p>
            <p className="text-xs text-gray-500">Openings</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Rocket size={20} className="text-primary-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">Fast</p>
            <p className="text-xs text-gray-500">Growing</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Users size={20} className="text-primary-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500">Team Members</p>
          </div>
        </div>

        <div className="space-y-3">
          {openings.map((job, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-xs text-gray-500">{job.type} • {job.location}</p>
              </div>
              <button className="px-3 py-1.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-lg">
                Apply
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Send your CV to careers@eventspace.ng
        </p>
      </main>

      <Footer />
    </div>
  )
}