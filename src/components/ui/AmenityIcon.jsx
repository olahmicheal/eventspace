import { 
  Car, Wifi, Music, Utensils, Snowflake, Monitor, Bed, Shield, Zap, Sun,
  Crown, Waves, Users, Wine, Eye, Headphones, Wind
} from 'lucide-react';
import { getAmenityIconColor } from '../../lib/utils';

const iconMap = {
  car: Car, wifi: Wifi, music: Music, utensils: Utensils,
  snowflake: Snowflake, monitor: Monitor, bed: Bed, shield: Shield,
  zap: Zap, sun: Sun, crown: Crown, waves: Waves,
  users: Users, wine: Wine, eye: Eye, headphones: Headphones, wind: Wind,
};

export default function AmenityIcon({ iconName, size = 20 }) {
  const IconComponent = iconMap[iconName] || Sun;
  const color = getAmenityIconColor(iconName);

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${color}15` }}>
      <IconComponent size={size} style={{ color }} strokeWidth={1.5} />
    </div>
  );
}