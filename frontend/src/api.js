const BASE_URL = 'http://localhost:8080/api';

/**
 * Helper to handle fetch responses and error extraction
 */
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data && data.error ? data.error : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Fetch all flights
 */
export async function getAllFlights() {
  const response = await fetch(`${BASE_URL}/flights`);
  return handleResponse(response);
}

/**
 * Search flights by source, destination, and optional date (linear search)
 */
export async function searchFlights(source, destination, date) {
  const params = new URLSearchParams({
    source: source.trim(),
    destination: destination.trim(),
  });

  if (date && date.trim()) {
    params.append('date', date.trim());
  }

  const response = await fetch(`${BASE_URL}/flights/search?${params.toString()}`);
  return handleResponse(response);
}

/**
 * Search flights by airline name (linear search)
 */
export async function searchByAirline(airline) {
  const params = new URLSearchParams({ airline: airline.trim() });
  const response = await fetch(`${BASE_URL}/flights/search/airline?${params.toString()}`);
  return handleResponse(response);
}

/**
 * Sort flights using DSA algorithm (bubble, insertion, merge, quick)
 */
export async function sortFlights(sortBy, algorithm) {
  const params = new URLSearchParams({
    sortBy: sortBy.trim(),
    algorithm: algorithm.trim(),
  });
  const response = await fetch(`${BASE_URL}/flights/sort?${params.toString()}`);
  return handleResponse(response);
}

/**
 * Search flights within a budget using binary search
 */
export async function searchByBudget(maxPrice) {
  const params = new URLSearchParams({ maxPrice: String(maxPrice).trim() });
  const response = await fetch(`${BASE_URL}/flights/budget?${params.toString()}`);
  return handleResponse(response);
}

/**
 * Book a flight with flightId and passengerName
 */
export async function bookFlight(flightId, passengerName) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      flightId: flightId.trim(),
      passengerName: passengerName.trim(),
    }),
  });
  return handleResponse(response);
}

/**
 * Fetch booking details by PNR (O(1) hash map lookup)
 */
export async function getBooking(pnr) {
  const response = await fetch(`${BASE_URL}/bookings/${encodeURIComponent(pnr.trim())}`);
  return handleResponse(response);
}

/**
 * Cancel a booking by PNR
 */
export async function cancelBooking(pnr) {
  const response = await fetch(`${BASE_URL}/bookings/${encodeURIComponent(pnr.trim())}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
