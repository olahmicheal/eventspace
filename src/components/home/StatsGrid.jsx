import { FileText, Calendar, Star, Clock } from 'lucide-react';
import { STATS } from '../../lib/constants';

const stats = [
  { icon: FileText, value: STATS.venues, label: 'Premium Venues', color: 'bg-primary-50 text-primary-600' },
  { icon: Calendar, value: STATS.events, label: 'Events Hosted', color: 'bg-primary-50 text-primary-600' },
  { icon: Star, value: `${STATS.rating}★`, label: 'Average Rating', color: 'bg-primary-50 text-primary-600' },
  { icon: Clock, value: STATS.responseTime, label: 'Response Time', color: 'bg-primary-50 text-primary-600' },
];

export default function StatsGrid() {
  return (
    <section className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white rounded-xl p-3 card-shadow"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}