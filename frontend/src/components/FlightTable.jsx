export default function FlightTable({ flights = [], onBook, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100 mb-6">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-gray-600 font-medium">Fetching flights from server...</p>
        <p className="text-xs text-gray-400 mt-1">Applying algorithm logic</p>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100 mb-6">
        <div className="text-4xl mb-3">✈️</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No Flights Found</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          We couldn't find any flights matching your criteria. Try adjusting your search route, airline, or budget limit.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Available Flights</h2>
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-indigo-600">{flights.length}</span> flight{flights.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
              <th className="py-3.5 px-4">Flight</th>
              <th className="py-3.5 px-4">Airline</th>
              <th className="py-3.5 px-4">Route</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Available Seats</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {flights.map((flight, idx) => {
              const isSoldOut = flight.availableSeats <= 0;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={flight.flightId || idx}
                  className={`transition-colors hover:bg-indigo-50/40 ${isEven ? 'bg-white' : 'bg-gray-50/40'}`}
                >
                  {/* Flight # */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {flight.flightNumber}
                  </td>

                  {/* Airline */}
                  <td className="py-3.5 px-4 font-medium text-gray-800 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                      {flight.airline}
                    </span>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium text-gray-800">
                      <span>{flight.source}</span>
                      <span className="text-gray-400">→</span>
                      <span>{flight.destination}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-gray-600 text-xs whitespace-nowrap">
                    {flight.date}
                  </td>

                  {/* Schedule */}
                  <td className="py-3.5 px-4 text-gray-700 text-xs whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{flight.departureTime}</div>
                    <div className="text-gray-400">arr: {flight.arrivalTime}</div>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 text-gray-600 text-xs whitespace-nowrap font-mono">
                    {flight.durationMinutes} min
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                    ₹{flight.price.toLocaleString('en-IN')}
                  </td>

                  {/* Seats */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isSoldOut ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                        Sold Out
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {flight.availableSeats} seat{flight.availableSeats !== 1 ? 's' : ''} left
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => onBook(flight)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSoldOut
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow'
                      }`}
                    >
                      {isSoldOut ? 'Sold Out' : 'Book Seat'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
