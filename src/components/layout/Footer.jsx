import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  const linkGroups = [
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Careers', to: '/careers' },
        { label: 'Press', to: '/press' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help', to: '/help' },
        { label: 'Safety', to: '/safety' },
        { label: 'Cancel', to: '/help' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', to: '/terms' },
        { label: 'Privacy', to: '/privacy' },
        { label: 'Cookies', to: '/privacy' },
      ]
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Brand */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary-600 mb-1">EventSpace</h3>
          <p className="text-sm text-gray-500">
            Find and book the perfect event space in Lagos, Nigeria.
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-primary-500" />
            Lagos, Nigeria
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} className="text-primary-500" />
            +234 800 000 0000
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={16} className="text-primary-500" />
            hello@eventspace.ng
          </div>
        </div>

        {/* Link Groups */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">{group.title}</h4>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social & Copyright */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Twitter size={16} />
            </a>
          </div>
          <p className="text-xs text-gray-400">© 2026 EventSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}