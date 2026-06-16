import AmenityIcon from '../ui/AmenityIcon';

export default function AmenityGrid({ amenities }) {
  const availableAmenities = amenities.filter(a => a.available);

  return (
    <section className="px-4 py-4">
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">What This Space Offers</h3>

        <div className="grid grid-cols-2 gap-3">
          {availableAmenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 card-shadow"
            >
              <AmenityIcon iconName={amenity.icon} />
              <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
            </div>
          ))}
        </div>

        {amenities.some(a => !a.available) && (
          <p className="text-xs text-gray-400 mt-3">
            Some amenities may be temporarily unavailable. Contact venue for details.
          </p>
        )}
      </div>
    </section>
  );
}