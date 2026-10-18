import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import SortControls from './components/SortControls';
import StatsStrip from './components/StatsStrip';
import FlightTable from './components/FlightTable';
import BookingModal from './components/BookingModal';
import BookingCheck from './components/BookingCheck';
import {
  getAllFlights,
  searchFlights,
  searchByAirline,
  sortFlights,
  searchByBudget,
} from './api';

export default function App() {
  const [flights, setFlights] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState(null);

  // Load initial flights on component mount
  useEffect(() => {
    fetchInitialFlights();
  }, []);

  const fetchInitialFlights = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllFlights();
      setFlights(data);
      setStats(null); // Clear previous sort stats when fresh list is loaded
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Linear search by Route (source, destination, optional date)
  const handleSearchRoute = async (source, destination, date) => {
    setLoading(true);
    setError('');
    setStats(null);
    try {
      const data = await searchFlights(source, destination, date);
      setFlights(data);
    } catch (err) {
      setError(err.message || 'Route search failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Linear search by Airline
  const handleSearchAirline = async (airline) => {
    setLoading(true);
    setError('');
    setStats(null);
    try {
      const data = await searchByAirline(airline);
      setFlights(data);
    } catch (err) {
      setError(err.message || 'Airline search failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Binary search by Budget
  const handleSearchBudget = async (maxPrice) => {
    setLoading(true);
    setError('');
    setStats(null);
    try {
      const data = await searchByBudget(maxPrice);
      setFlights(data);
    } catch (err) {
      setError(err.message || 'Budget binary search failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Manual DSA Sorts
  const handleSort = async (sortBy, algorithm) => {
    setLoading(true);
    setError('');
    try {
      const result = await sortFlights(sortBy, algorithm);
      setFlights(result.flights || []);
      setStats({
        algorithmUsed: result.algorithmUsed,
        sortedBy: result.sortedBy,
        comparisons: result.comparisons,
        timeTakenMs: result.timeTakenMs,
      });
    } catch (err) {
      setError(err.message || 'Sorting execution failed.');
    } finally {
      setLoading(false);
    }
  };

  // Callback after successful booking or cancellation to refresh flight list & seats
  const handleRefreshData = async () => {
    try {
      const data = await getAllFlights();
      setFlights(data);
    } catch (err) {
      console.error('Failed to refresh flights list:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navigation / Header */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Flight Reservation System</h1>
              <p className="text-xs text-indigo-200">DSA Algorithms & Time Complexity Demo</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs bg-indigo-800/60 px-3 py-1.5 rounded-lg border border-indigo-600">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>In-Memory Storage • Spring Boot 3</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-xs flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">⚠️</span>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800 text-sm font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Search Controls */}
        <SearchForm
          onSearchRoute={handleSearchRoute}
          onSearchAirline={handleSearchAirline}
          onSearchBudget={handleSearchBudget}
          onShowAll={fetchInitialFlights}
          loading={loading}
        />

        {/* 2. Sorting Controls */}
        <SortControls onSort={handleSort} loading={loading} />

        {/* 3. Benchmark Statistics Strip (after sort) */}
        <StatsStrip stats={stats} />

        {/* 4. Flight Results Table */}
        <FlightTable
          flights={flights}
          onBook={(flight) => setSelectedFlightForBooking(flight)}
          loading={loading}
        />

        {/* 5. Booking Lookup and Cancellation Section */}
        <BookingCheck onBookingUpdated={handleRefreshData} />
      </main>

      {/* Booking Modal */}
      {selectedFlightForBooking && (
        <BookingModal
          flight={selectedFlightForBooking}
          onClose={() => setSelectedFlightForBooking(null)}
          onBooked={() => {
            handleRefreshData();
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500 mt-auto">
        <p>Flight Reservation System • Data Structures & Algorithms Viva Project</p>
        <p className="mt-1 text-gray-400">Linear Search • Binary Search • HashMap O(1) • Bubble, Insertion, Merge & Quick Sort</p>
      </footer>
    </div>
  );
}
