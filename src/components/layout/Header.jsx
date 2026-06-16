import { MapPin } from 'lucide-react';
import { APP_NAME, DEFAULT_LOCATION } from '../../lib/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary-600 to-accent-pink bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </h1>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <MapPin size={16} className="text-gray-400" />
          <span>{DEFAULT_LOCATION}</span>
        </div>
      </div>
    </header>
  );
}