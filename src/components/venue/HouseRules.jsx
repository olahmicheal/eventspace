export default function HouseRules({ rules }) {
  return (
    <section className="px-4 py-4">
      <div className="max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">House Rules</h3>

        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-600">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}