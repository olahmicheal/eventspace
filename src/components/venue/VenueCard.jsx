import { MapPin, Users, Heart, Star, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../lib/utils';
import { useVenueStore } from '../../stores/venueStore';

export default function VenueCard({ venue }) {
  const navigate = useNavigate();
  const isFav = useVenueStore((state) => state.isFavorite(venue.id));
  const toggleFav = useVenueStore((state) => state.toggleFavorite);

  return (
    <div 
      onClick={() => navigate(`/venue/${venue.id}`)}
      className="bg-white rounded-2xl overflow-hidden card-shadow cursor-pointer hover:card-shadow-hover transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-52 object-cover"
          loading="lazy"
        />

        {/* Discount Badge */}
        {venue.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            -{venue.discount}%
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
          <span className="text-sm font-bold">{formatPrice(venue.pricePerHour, venue.currency)}</span>
          <span className="text-xs font-normal">/hr</span>
        </div>

        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(venue.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart 
            size={18} 
            className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
            strokeWidth={1.5}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-gray-800">{venue.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{venue.name}</h4>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin size={14} />
          <span>{venue.location}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <Users size={14} />
          <span>Up to {venue.capacity} guests</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {venue.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}