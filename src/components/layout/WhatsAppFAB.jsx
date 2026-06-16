import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../lib/utils';

export default function WhatsAppFAB({ venueName = 'EventSpace' }) {
  return (
    <a
      href={generateWhatsAppLink(venueName)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg shadow-whatsapp/30 hover:scale-110 transition-transform duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="text-white" fill="white" strokeWidth={0} />
    </a>
  );
}