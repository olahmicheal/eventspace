import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function VenueGallery({ images, venueName }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative w-full h-72">
        <img
          src={images[currentIndex]}
          alt={`${venueName} - ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 p-3 overflow-x-auto hide-scrollbar bg-white">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex ? 'border-primary-500' : 'border-transparent'
            }`}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}