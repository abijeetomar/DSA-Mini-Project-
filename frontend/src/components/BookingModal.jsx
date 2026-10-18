import { useState } from 'react';
import { bookFlight } from '../api';

export default function BookingModal({ flight, onClose, onBooked }) {
  const [passengerName, setPassengerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!flight) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      setError('Please enter passenger name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const booking = await bookFlight(flight.flightId, passengerName.trim());
      setConfirmedBooking(booking);
      if (onBooked) {
        onBooked(booking);
      }
    } catch (err) {
      setError(err.message || 'Failed to book flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {confirmedBooking ? '🎉 Booking Confirmed!' : '✈️ Confirm Flight Booking'}
            </h3>
            <p className="text-xs text-indigo-100">
              {flight.airline} • {flight.flightNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold p-1 leading-none rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Flight Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200/70 text-sm">
            <div className="flex items-center justify-between font-semibold text-gray-800 text-base mb-2">
              <span>{flight.source}</span>
              <span className="text-indigo-600 font-mono text-xs px-2 py-0.5 bg-indigo-50 rounded border border-indigo-200">
                {flight.durationMinutes} min
              </span>
              <span>{flight.destination}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-400">Date:</span> {flight.date}
              </div>
              <div>
                <span className="text-gray-400">Time:</span> {flight.departureTime} → {flight.arrivalTime}
              </div>
              <div>
                <span className="text-gray-400">Fare:</span> <strong className="text-gray-900 font-bold">₹{flight.price.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-gray-400">Seats Left:</span> {flight.availableSeats}
              </div>
            </div>
          </div>

          {confirmedBooking ? (
            /* Booking Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full text-2xl mb-3 shadow-inner">
                ✓
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Reservation Successful!</h4>
              <p className="text-xs text-gray-500 mb-4">
                Your ticket has been generated and stored in the system HashMap for O(1) lookup.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
                <div className="flex items-center justify-between border-b border-amber-200/70 pb-2 mb-2">
                  <span className="text-xs uppercase font-bold text-amber-800">Booking PNR</span>
                  <span className="text-lg font-mono font-black text-amber-900 tracking-wider">
                    {confirmedBooking.pnr}
                  </span>
                </div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div><strong>Passenger:</strong> {confirmedBooking.passengerName}</div>
                  <div><strong>Flight ID:</strong> {confirmedBooking.flightId} ({confirmedBooking.flightNumber})</div>
                  <div><strong>Booking Date:</strong> {confirmedBooking.bookingDate}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all text-sm cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Passenger Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Booking Seat...
                    </>
                  ) : (
                    <span>Confirm & Generate PNR</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
