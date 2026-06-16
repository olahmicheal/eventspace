import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Back' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft size={20} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}