package com.dsa.flightreservation.service;

import com.dsa.flightreservation.exception.FlightException;
import com.dsa.flightreservation.model.Booking;
import com.dsa.flightreservation.model.Flight;
import com.dsa.flightreservation.model.SortResult;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Service implementing all core data structures, searching algorithms,
 * manual sorting algorithms, and reservation workflows.
 */
@Service
public class FlightService {

    // Primary in-memory list of all available flights
    private final List<Flight> flightList = new ArrayList<>();

    // Hash map for fast O(1) lookup of bookings using PNR as the unique key
    private final Map<String, Booking> bookingMap = new HashMap<>();

    private final Random random = new Random();

    // ==========================================
    // Core Flight Operations
    // ==========================================

    /**
     * Adds a new flight into the system list.
     */
    public synchronized void addFlight(Flight flight) {
        if (flight != null) {
            flightList.add(flight);
        }
    }

    /**
     * Returns a copy of all flights currently in the system.
     */
    public synchronized List<Flight> getAllFlights() {
        return new ArrayList<>(flightList);
    }

    // ==========================================
    // SEARCHING ALGORITHMS
    // ==========================================

    /**
     * Linear Search: Check each element one by one until we find matches. Time: O(n)
     *
     * Iterates through every flight in the list and compares the source and destination
     * (case-insensitively). If a specific date is provided, it filters by date as well.
     */
    public List<Flight> linearSearchByRoute(String source, String destination, String date) {
        if (source == null || destination == null) {
            throw new FlightException("Source and destination must be provided for route search.");
        }

        List<Flight> matchingFlights = new ArrayList<>();
        String normalizedSource = source.trim();
        String normalizedDestination = destination.trim();
        boolean hasDateFilter = (date != null && !date.trim().isEmpty());
        String normalizedDate = hasDateFilter ? date.trim() : "";

        // Iterate through each flight sequentially - O(n) linear scan
        for (int i = 0; i < flightList.size(); i++) {
            Flight currentFlight = flightList.get(i);
            boolean sourceMatches = currentFlight.getSource().equalsIgnoreCase(normalizedSource);
            boolean destinationMatches = currentFlight.getDestination().equalsIgnoreCase(normalizedDestination);

            if (sourceMatches && destinationMatches) {
                if (hasDateFilter) {
                    if (currentFlight.getDate().equalsIgnoreCase(normalizedDate)) {
                        matchingFlights.add(currentFlight);
                    }
                } else {
                    matchingFlights.add(currentFlight);
                }
            }
        }

        return matchingFlights;
    }

    /**
     * Linear Search: Check each element one by one until we find matches. Time: O(n)
     *
     * Iterates through every flight to check if the airline name matches or contains
     * the query string (case-insensitively).
     */
    public List<Flight> linearSearchByAirline(String airline) {
        if (airline == null || airline.trim().isEmpty()) {
            throw new FlightException("Airline query cannot be empty.");
        }

        List<Flight> matchingFlights = new ArrayList<>();
        String query = airline.trim().toLowerCase();

        // Examine each flight one by one
        for (int i = 0; i < flightList.size(); i++) {
            Flight currentFlight = flightList.get(i);
            if (currentFlight.getAirline().toLowerCase().contains(query)) {
                matchingFlights.add(currentFlight);
            }
        }

        return matchingFlights;
    }

    /**
     * Binary Search needs SORTED data. We find the rightmost flight within budget using divide-and-conquer. Time: O(log n) for search, but O(n²) for the prerequisite sort.
     *
     * Step 1: Create a clone of the flight list and sort it by price using bubble sort.
     * Step 2: Use binary search to find the upper boundary index of flights whose price <= maxPrice.
     * Step 3: Return all flights from index 0 up to that boundary index.
     */
    public List<Flight> binarySearchByBudget(double maxPrice) {
        if (maxPrice < 0) {
            throw new FlightException("Budget maxPrice cannot be negative.");
        }

        // Make an independent copy so original list order is unmodified
        List<Flight> sortedFlights = new ArrayList<>(flightList);

        // Prerequisite: Sort the copy ascending by price using manual bubble sort
        bubbleSortByPriceInternal(sortedFlights, new long[]{0});

        // Binary Search for the rightmost flight having price <= maxPrice
        int low = 0;
        int high = sortedFlights.size() - 1;
        int rightmostIndexWithinBudget = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            Flight midFlight = sortedFlights.get(mid);

            if (midFlight.getPrice() <= maxPrice) {
                // This flight qualifies. Check the right half to see if higher-priced flights still fit budget.
                rightmostIndexWithinBudget = mid;
                low = mid + 1;
            } else {
                // Price exceeds budget, eliminate right half and search left half
                high = mid - 1;
            }
        }

        List<Flight> flightsWithinBudget = new ArrayList<>();
        if (rightmostIndexWithinBudget != -1) {
            for (int i = 0; i <= rightmostIndexWithinBudget; i++) {
                flightsWithinBudget.add(sortedFlights.get(i));
            }
        }

        return flightsWithinBudget;
    }

    // ==========================================
    // SORTING ALGORITHMS
    // ==========================================

    /**
     * Dispatcher method to trigger the appropriate sorting algorithm based on sortBy and algorithm parameters.
     */
    public SortResult sortFlights(String sortBy, String algorithm) {
        if (sortBy == null || algorithm == null) {
            throw new FlightException("Both 'sortBy' and 'algorithm' parameters are required.");
        }

        String normalizedAlgorithm = algorithm.trim().toLowerCase();
        String normalizedSortBy = sortBy.trim().toLowerCase();
        List<Flight> copyForSorting = new ArrayList<>(flightList);

        switch (normalizedAlgorithm) {
            case "bubble":
                if (!normalizedSortBy.equals("price")) {
                    throw new FlightException("Bubble sort is configured for 'price'. Pick 'price' as sortBy.");
                }
                return bubbleSortByPrice(copyForSorting);

            case "quick":
                if (!normalizedSortBy.equals("price")) {
                    throw new FlightException("Quick sort is configured for 'price'. Pick 'price' as sortBy.");
                }
                return quickSortByPrice(copyForSorting);

            case "insertion":
                if (!normalizedSortBy.equals("departuretime")) {
                    throw new FlightException("Insertion sort is configured for 'departureTime'. Pick 'departureTime' as sortBy.");
                }
                return insertionSortByDepartureTime(copyForSorting);

            case "merge":
                if (!normalizedSortBy.equals("duration")) {
                    throw new FlightException("Merge sort is configured for 'duration'. Pick 'duration' as sortBy or use bubble/quick for price.");
                }
                return mergeSortByDuration(copyForSorting);

            default:
                throw new FlightException("Unsupported algorithm: '" + algorithm + "'. Supported algorithms are 'bubble', 'insertion', 'merge', 'quick'.");
        }
    }

    /**
     * Bubble Sort: Repeatedly swap adjacent elements if they are in the wrong order. Time: O(n²), Space: O(1)
     */
    public SortResult bubbleSortByPrice(List<Flight> flights) {
        long[] comparisons = new long[]{0};
        long startTime = System.nanoTime();

        bubbleSortByPriceInternal(flights, comparisons);

        long endTime = System.nanoTime();
        long timeTakenMs = (endTime - startTime) / 1_000_000L;

        return new SortResult(flights, "Bubble Sort", "price", timeTakenMs, comparisons[0]);
    }

    /**
     * Internal manual implementation of Bubble Sort sorting ascending by price.
     */
    private void bubbleSortByPriceInternal(List<Flight> flights, long[] comparisons) {
        int n = flights.size();
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                comparisons[0]++;
                Flight firstFlight = flights.get(j);
                Flight secondFlight = flights.get(j + 1);

                if (firstFlight.getPrice() > secondFlight.getPrice()) {
                    // Swap adjacent flights
                    Flight tempFlight = firstFlight;
                    flights.set(j, secondFlight);
                    flights.set(j + 1, tempFlight);
                    swapped = true;
                }
            }
            // Optimization: if no two elements were swapped by inner loop, array is sorted
            if (!swapped) {
                break;
            }
        }
    }

    /**
     * Insertion Sort: Pick each element and insert it into its correct position in the sorted portion. Time: O(n²), Space: O(1)
     */
    public SortResult insertionSortByDepartureTime(List<Flight> flights) {
        long[] comparisons = new long[]{0};
        long startTime = System.nanoTime();

        int n = flights.size();
        for (int i = 1; i < n; i++) {
            Flight currentFlightToInsert = flights.get(i);
            int j = i - 1;

            // Compare departure times in "HH:mm" format using lexicographical compareTo
            while (j >= 0) {
                comparisons[0]++;
                Flight previousFlight = flights.get(j);
                if (previousFlight.getDepartureTime().compareTo(currentFlightToInsert.getDepartureTime()) > 0) {
                    flights.set(j + 1, previousFlight);
                    j--;
                } else {
                    break;
                }
            }
            flights.set(j + 1, currentFlightToInsert);
        }

        long endTime = System.nanoTime();
        long timeTakenMs = (endTime - startTime) / 1_000_000L;

        return new SortResult(flights, "Insertion Sort", "departureTime", timeTakenMs, comparisons[0]);
    }

    /**
     * Public wrapper for Merge Sort by duration. Measures execution time and returns SortResult.
     */
    public SortResult mergeSortByDuration(List<Flight> flights) {
        long[] comparisons = new long[]{0};
        long startTime = System.nanoTime();

        List<Flight> sortedFlights = mergeSortByDuration(flights, comparisons);

        long endTime = System.nanoTime();
        long timeTakenMs = (endTime - startTime) / 1_000_000L;

        return new SortResult(sortedFlights, "Merge Sort", "duration", timeTakenMs, comparisons[0]);
    }

    /**
     * Merge Sort: Divide the list into halves, sort each half, then merge them back. Time: O(n log n), Space: O(n)
     */
    public List<Flight> mergeSortByDuration(List<Flight> flights, long[] comparisons) {
        // Base case: list of size 0 or 1 is already sorted
        if (flights.size() <= 1) {
            return flights;
        }

        int midIndex = flights.size() / 2;

        // Manually partition into leftHalf and rightHalf without streams
        List<Flight> leftHalf = new ArrayList<>();
        for (int i = 0; i < midIndex; i++) {
            leftHalf.add(flights.get(i));
        }

        List<Flight> rightHalf = new ArrayList<>();
        for (int i = midIndex; i < flights.size(); i++) {
            rightHalf.add(flights.get(i));
        }

        // Recursively sort both sub-lists
        List<Flight> sortedLeftHalf = mergeSortByDuration(leftHalf, comparisons);
        List<Flight> sortedRightHalf = mergeSortByDuration(rightHalf, comparisons);

        // Merge sorted halves based on durationMinutes
        return mergeByDuration(sortedLeftHalf, sortedRightHalf, comparisons);
    }

    /**
     * Merges two sorted lists into one sorted list based on durationMinutes.
     */
    private List<Flight> mergeByDuration(List<Flight> leftHalf, List<Flight> rightHalf, long[] comparisons) {
        List<Flight> mergedList = new ArrayList<>();
        int leftPointer = 0;
        int rightPointer = 0;

        while (leftPointer < leftHalf.size() && rightPointer < rightHalf.size()) {
            comparisons[0]++;
            Flight leftFlight = leftHalf.get(leftPointer);
            Flight rightFlight = rightHalf.get(rightPointer);

            if (leftFlight.getDurationMinutes() <= rightFlight.getDurationMinutes()) {
                mergedList.add(leftFlight);
                leftPointer++;
            } else {
                mergedList.add(rightFlight);
                rightPointer++;
            }
        }

        // Append any remaining elements from leftHalf
        while (leftPointer < leftHalf.size()) {
            mergedList.add(leftHalf.get(leftPointer));
            leftPointer++;
        }

        // Append any remaining elements from rightHalf
        while (rightPointer < rightHalf.size()) {
            mergedList.add(rightHalf.get(rightPointer));
            rightPointer++;
        }

        return mergedList;
    }

    /**
     * Public wrapper for Quick Sort by price. Measures execution time and returns SortResult.
     */
    public SortResult quickSortByPrice(List<Flight> flights) {
        long[] comparisons = new long[]{0};
        long startTime = System.nanoTime();

        if (flights.size() > 1) {
            quickSortByPrice(flights, 0, flights.size() - 1, comparisons);
        }

        long endTime = System.nanoTime();
        long timeTakenMs = (endTime - startTime) / 1_000_000L;

        return new SortResult(flights, "Quick Sort", "price", timeTakenMs, comparisons[0]);
    }

    /**
     * Quick Sort: Pick a pivot, partition elements around it, then sort each partition. Time: O(n log n) avg, O(n²) worst, Space: O(log n)
     */
    public void quickSortByPrice(List<Flight> flights, int low, int high, long[] comparisons) {
        if (low < high) {
            // Partition index: flights[partitionIndex] is now in its final sorted position
            int partitionIndex = partitionByPrice(flights, low, high, comparisons);

            // Recursively sort elements before and after partition
            quickSortByPrice(flights, low, partitionIndex - 1, comparisons);
            quickSortByPrice(flights, partitionIndex + 1, high, comparisons);
        }
    }

    /**
     * Partitions the sub-list using the last element as the pivot.
     */
    private int partitionByPrice(List<Flight> flights, int low, int high, long[] comparisons) {
        Flight pivotFlight = flights.get(high);
        double pivotPrice = pivotFlight.getPrice();
        int smallerElementIndex = low - 1;

        for (int j = low; j < high; j++) {
            comparisons[0]++;
            Flight currentFlight = flights.get(j);

            // If current flight has smaller or equal price compared to pivot
            if (currentFlight.getPrice() <= pivotPrice) {
                smallerElementIndex++;
                // Swap flights at smallerElementIndex and j
                Flight temp = flights.get(smallerElementIndex);
                flights.set(smallerElementIndex, currentFlight);
                flights.set(j, temp);
            }
        }

        // Place pivot flight in its correct sorted position
        Flight temp = flights.get(smallerElementIndex + 1);
        flights.set(smallerElementIndex + 1, flights.get(high));
        flights.set(high, temp);

        return smallerElementIndex + 1;
    }

    // ==========================================
    // BOOKING OPERATIONS
    // ==========================================

    /**
     * Books a seat on the specified flight for the given passenger.
     * Decrements available seats and generates a unique PNR stored in HashMap for O(1) lookup.
     */
    public synchronized Booking bookFlight(String flightId, String passengerName) {
        if (flightId == null || flightId.trim().isEmpty()) {
            throw new FlightException("Flight ID is required.");
        }
        if (passengerName == null || passengerName.trim().isEmpty()) {
            throw new FlightException("Passenger name is required.");
        }

        // Linear search to find the flight by flightId
        Flight targetFlight = null;
        for (int i = 0; i < flightList.size(); i++) {
            Flight flight = flightList.get(i);
            if (flight.getFlightId().equalsIgnoreCase(flightId.trim())) {
                targetFlight = flight;
                break;
            }
        }

        if (targetFlight == null) {
            throw new FlightException("Flight with ID '" + flightId + "' not found.");
        }

        // Check seat availability
        if (targetFlight.getAvailableSeats() <= 0) {
            throw new FlightException("No seats available on flight " + targetFlight.getFlightNumber() + " (" + flightId + ").");
        }

        // Decrement available seat count
        targetFlight.setAvailableSeats(targetFlight.getAvailableSeats() - 1);

        // Generate a 6-digit unique PNR: "PNR" + random 6-digit number
        int randomSixDigit = 100000 + random.nextInt(900000);
        String pnr = "PNR" + randomSixDigit;
        while (bookingMap.containsKey(pnr)) {
            randomSixDigit = 100000 + random.nextInt(900000);
            pnr = "PNR" + randomSixDigit;
        }

        String bookingDate = LocalDate.now().toString();

        Booking booking = new Booking(
                pnr,
                targetFlight.getFlightId(),
                targetFlight.getFlightNumber(),
                passengerName.trim(),
                bookingDate
        );

        // Store in HashMap for O(1) lookup
        bookingMap.put(pnr, booking);

        return booking;
    }

    /**
     * Looks up a booking by its PNR in O(1) average time complexity using HashMap.
     */
    public synchronized Booking getBooking(String pnr) {
        if (pnr == null || pnr.trim().isEmpty()) {
            throw new FlightException("PNR cannot be empty.");
        }

        Booking booking = bookingMap.get(pnr.trim().toUpperCase());
        if (booking == null) {
            // Also attempt case-sensitive check if exact key match was not found
            booking = bookingMap.get(pnr.trim());
        }

        if (booking == null) {
            throw new FlightException("Booking with PNR '" + pnr + "' not found.");
        }

        return booking;
    }

    /**
     * Cancels an existing booking. Increments the flight's available seat count
     * and removes the booking from the HashMap.
     */
    public synchronized Booking cancelBooking(String pnr) {
        Booking booking = getBooking(pnr);

        // Linear search to find the flight and release the booked seat
        for (int i = 0; i < flightList.size(); i++) {
            Flight flight = flightList.get(i);
            if (flight.getFlightId().equalsIgnoreCase(booking.getFlightId())) {
                flight.setAvailableSeats(flight.getAvailableSeats() + 1);
                break;
            }
        }

        // Remove from map
        bookingMap.remove(booking.getPnr());

        return booking;
    }
}
