import { useState } from 'react';

export default function SearchForm({
  onSearchRoute,
  onSearchAirline,
  onSearchBudget,
  onShowAll,
  loading = false,
}) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [airline, setAirline] = useState('');
  const [budget, setBudget] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setValidationError('');

    const hasRoute = source.trim() !== '' || destination.trim() !== '';
    const hasAirline = airline.trim() !== '';
    const hasBudget = budget.trim() !== '';

    if (hasRoute) {
      if (!source.trim() || !destination.trim()) {
        setValidationError('Please provide both Source and Destination for route search.');
        return;
      }
      onSearchRoute(source.trim(), destination.trim(), date.trim());
      return;
    }

    if (hasAirline) {
      onSearchAirline(airline.trim());
      return;
    }

    if (hasBudget) {
      const parsedBudget = parseFloat(budget);
      if (isNaN(parsedBudget) || parsedBudget <= 0) {
        setValidationError('Please provide a valid positive budget amount.');
        return;
      }
      onSearchBudget(parsedBudget);
      return;
    }

    // Default to show all if search is clicked without filters
    onShowAll();
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    setDate('');
    setAirline('');
    setBudget('');
    setValidationError('');
    onShowAll();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🔍</span> Find Flights
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Search by route (Linear Search), airline, or maximum budget (Binary Search).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-200">
            Route/Airline: Linear O(n)
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-full border border-emerald-200">
            Budget: Binary O(log n)
          </span>
        </div>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Source */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. DEL, Mumbai"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. BLR, Goa"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Travel Date (Optional)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
            />
          </div>

          {/* Airline */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Airline (Optional)
            </label>
            <input
              type="text"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              placeholder="e.g. IndiGo, Air India"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
            />
          </div>

          {/* Max Budget */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Max Budget (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Show All / Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <span>Search Flights</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
