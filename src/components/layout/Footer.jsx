import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { APP_NAME } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold gradient-text mb-2">{APP_NAME}</h3>
          <p className="text-sm text-gray-500">
            Find and book the perfect event space in Lagos, Nigeria.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin size={16} className="text-primary-500" />
            <span>Lagos, Nigeria</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone size={16} className="text-primary-500" />
            <span>+234 800 000 0000</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} className="text-primary-500" />
            <span>hello@eventspace.ng</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Company</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">About</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Careers</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Support</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Help</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Safety</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Cancel</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Legal</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Terms</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Privacy</a></li>
              <li><a href="#" className="text-xs text-gray-500 hover:text-primary-600">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors">
              <Instagram size={16} className="text-gray-600" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors">
              <Facebook size={16} className="text-gray-600" />
            </a>
            <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors">
              <Twitter size={16} className="text-gray-600" />
            </a>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}