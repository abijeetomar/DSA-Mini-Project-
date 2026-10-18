import { useState } from 'react';
import { getBooking, cancelBooking } from '../api';

export default function BookingCheck({ onBookingUpdated }) {
  const [pnr, setPnr] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pnr.trim()) {
      setError('Please enter a PNR number.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setBooking(null);

    try {
      const data = await getBooking(pnr.trim());
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Booking not found with this PNR.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!pnr.trim()) {
      setError('Please enter a PNR number to cancel.');
      return;
    }

    if (!window.confirm(`Are you sure you want to cancel booking for PNR: ${pnr.trim()}?`)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const cancelled = await cancelBooking(pnr.trim());
      setSuccessMessage(`Booking for PNR ${cancelled.pnr} has been successfully cancelled and seat released!`);
      setBooking(null);
      setPnr('');
      if (onBookingUpdated) {
        onBookingUpdated();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-100 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🎫</span> Manage Reservation by PNR
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Demonstrates HashMap key-value retrieval in <span className="font-semibold text-indigo-600">O(1)</span> time.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-mono text-xs font-semibold rounded-full border border-purple-200 self-start sm:self-auto">
          HashMap Lookup: O(1)
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end mb-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Enter 6-Digit PNR (e.g. PNR123456)
          </label>
          <input
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value.toUpperCase())}
            placeholder="PNR123456"
            className="w-full px-3 py-2 text-sm font-mono uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Booking'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={loading || !pnr.trim()}
          className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
        >
          Cancel Booking
        </button>
      </form>

      {/* Booking Details Card */}
      {booking && (
        <div className="mt-4 p-5 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-100">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-700">Verified Booking Record</span>
              <h3 className="text-lg font-mono font-black text-gray-900">{booking.pnr}</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
              Active Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Passenger Name</span>
              <span className="text-sm font-bold text-gray-800">{booking.passengerName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Flight ID</span>
              <span className="text-sm font-bold text-gray-800">{booking.flightId}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Flight Number</span>
              <span className="text-sm font-bold text-indigo-700 font-mono">{booking.flightNumber}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Date of Booking</span>
              <span className="text-sm font-bold text-gray-800">{booking.bookingDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
