export default function PerfectFor({ tags }) {
  return (
    <section className="px-4 py-4">
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect For</h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}