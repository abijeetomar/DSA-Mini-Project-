import { useState, useEffect } from 'react';

export default function SortControls({ onSort, loading = false }) {
  const [sortBy, setSortBy] = useState('price');
  const [algorithm, setAlgorithm] = useState('bubble');

  // Auto-sync valid algorithm when sortBy changes to provide a seamless UX
  useEffect(() => {
    if (sortBy === 'price' && algorithm !== 'bubble' && algorithm !== 'quick') {
      setAlgorithm('bubble');
    } else if (sortBy === 'departureTime') {
      setAlgorithm('insertion');
    } else if (sortBy === 'duration') {
      setAlgorithm('merge');
    }
  }, [sortBy]);

  const handleSort = (e) => {
    e.preventDefault();
    onSort(sortBy, algorithm);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-100 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>⚡</span> Compare Sorting Algorithms
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Select a criteria and sorting algorithm to benchmark comparisons and execution time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <span className="font-semibold text-gray-700">Supported Mappings:</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">Price → Bubble / Quick</span>
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">Time → Insertion</span>
          <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-mono">Duration → Merge</span>
        </div>
      </div>

      <form onSubmit={handleSort} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
        {/* Sort By Field */}
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Sort Criteria (Field)
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer"
          >
            <option value="price">Price (₹) — Numeric</option>
            <option value="departureTime">Departure Time (HH:mm) — Lexicographical</option>
            <option value="duration">Flight Duration (Minutes) — Divide & Conquer</option>
          </select>
        </div>

        {/* Algorithm Field */}
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Sorting Algorithm (Manual DSA)
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer"
          >
            {sortBy === 'price' && (
              <>
                <option value="bubble">Bubble Sort — O(n²), Stable</option>
                <option value="quick">Quick Sort — O(n log n) avg, In-place</option>
              </>
            )}
            {sortBy === 'departureTime' && (
              <option value="insertion">Insertion Sort — O(n²), Efficient for partially sorted</option>
            )}
            {sortBy === 'duration' && (
              <option value="merge">Merge Sort — O(n log n), Stable Divide & Conquer</option>
            )}
          </select>
        </div>

        {/* Sort Button */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sorting...
              </span>
            ) : (
              <span>Sort Flights ⚡</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
