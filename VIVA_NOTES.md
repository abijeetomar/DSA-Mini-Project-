# ✈️ Flight Reservation System — Viva Notes & Project Guide

## 📁 Project Folder Structure

```
flight-reservation-system/
├── backend/                              # Spring Boot 3 + Java 17
│   ├── pom.xml                           # Maven dependencies
│   └── src/main/
│       ├── resources/
│       │   └── application.properties    # Server config
│       └── java/com/dsa/flightreservation/
│           ├── FlightReservationApplication.java   # Entry point
│           ├── model/
│           │   ├── Flight.java           # Flight POJO
│           │   ├── Booking.java          # Booking POJO
│           │   └── SortResult.java       # Sort response wrapper (flights + stats)
│           ├── exception/
│           │   ├── FlightException.java          # Custom exception
│           │   └── GlobalExceptionHandler.java   # Centralized error handling
│           ├── config/
│           │   └── CorsConfig.java       # CORS for React dev server
│           ├── data/
│           │   └── DataLoader.java       # Preloads 25-30 sample flights
│           ├── service/
│           │   └── FlightService.java    # ⭐ ALL DSA logic lives here
│           └── controller/
│               ├── FlightController.java   # /api/flights endpoints
│               └── BookingController.java  # /api/bookings endpoints
│
├── frontend/                             # React + Vite + Tailwind
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                      # React entry point
│       ├── index.css                     # Tailwind imports
│       ├── api.js                        # Backend API calls
│       ├── App.jsx                       # Main app layout & state
│       └── components/
│           ├── SearchForm.jsx            # Search by route/airline/budget
│           ├── SortControls.jsx          # Sort by + algorithm picker
│           ├── FlightTable.jsx           # Results table with Book button
│           ├── StatsStrip.jsx            # Algorithm stats banner
│           ├── BookingModal.jsx          # Book a flight modal
│           └── BookingCheck.jsx          # Check/cancel booking by PNR
```

---

## 🚀 How to Run

### Backend (Terminal 1)
```bash
cd flight-reservation-system/backend
mvn spring-boot:run
# Starts on http://localhost:8080
```

### Frontend (Terminal 2)
```bash
cd flight-reservation-system/frontend
npm install
npm run dev
# Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

> [!NOTE]
> Make sure you have Java 17+ and Node.js 18+ installed.

---

## 🔍 Algorithm Complexity — Quick Reference Table

| Algorithm | Type | Time (Best) | Time (Average) | Time (Worst) | Space | Stable? |
|-----------|------|-------------|----------------|--------------|-------|---------|
| **Linear Search** | Search | O(1) | O(n) | O(n) | O(1) | — |
| **Binary Search** | Search | O(1) | O(log n) | O(log n) | O(1) | — |
| **HashMap Lookup** | Search | O(1) | O(1) | O(n)* | O(n) | — |
| **Bubble Sort** | Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ Yes |
| **Insertion Sort** | Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ Yes |
| **Merge Sort** | Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ Yes |
| **Quick Sort** | Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ No |

*\* HashMap worst case O(n) occurs only with extremely poor hash collisions; in practice it's O(1).*

---

## 📝 Viva Q&A — Searching Algorithms

### Q: What is Linear Search? Why did you use it for route search?
**A:** Linear Search checks **every element one by one** from start to end. I used it for route search (source + destination) because:
- The flight list is **unsorted** by route — there's no natural ordering of city pairs
- We need to find **all** matching flights, not just one
- It's the simplest approach and works perfectly for small datasets (25-30 flights)
- **Time: O(n)** — we visit each flight at most once

### Q: What is Binary Search? Why does it need sorted data?
**A:** Binary Search works by **repeatedly dividing the search space in half**:
1. Compare the target with the **middle** element
2. If target < middle → search the **left half**
3. If target > middle → search the **right half**
4. Repeat until found

It **requires sorted data** because the divide-and-conquer logic depends on knowing that all elements to the left are smaller and all to the right are larger. Without this guarantee, discarding half the array would skip valid results.

I used it for **budget search** (find flights ≤ maxPrice): sort by price first, then binary search for the boundary where price exceeds the budget.

**Time: O(log n)** for the search itself, but **O(n²)** for the prerequisite bubble sort.

### Q: What is the difference between Linear and Binary Search?

| Feature | Linear Search | Binary Search |
|---------|--------------|---------------|
| Data requirement | Works on **any** list | Needs **sorted** list |
| Approach | Sequential scan | Divide-and-conquer |
| Time complexity | O(n) | O(log n) |
| Best for | Small/unsorted data, finding all matches | Large sorted data, finding one element |
| Implementation | Simpler | Slightly more complex |

### Q: How does HashMap give O(1) lookup for bookings?
**A:** A HashMap uses a **hash function** to compute an index from the key (PNR string). The PNR maps directly to a bucket in an internal array, so we jump straight to the booking without scanning. This gives **constant time O(1)** average-case lookup regardless of how many bookings exist.

---

## 📝 Viva Q&A — Sorting Algorithms

### Q: Explain Bubble Sort. Why did you use it for price?
**A:** Bubble Sort repeatedly **compares adjacent elements** and swaps them if they're in the wrong order. After each pass, the largest unsorted element "bubbles up" to its correct position.

```
Pass 1: [5,3,8,1] → [3,5,1,8]  (8 bubbled to end)
Pass 2: [3,5,1,8] → [3,1,5,8]  (5 bubbled to position)
Pass 3: [3,1,5,8] → [1,3,5,8]  (3 bubbled to position)
```

I used it for **price** because price is a simple numeric comparison, and Bubble Sort is the easiest algorithm to explain and implement. It's O(n²) but fine for 30 flights.

### Q: Explain Insertion Sort. Why for departure time?
**A:** Insertion Sort builds a sorted portion from left to right. For each new element, it **shifts** larger elements right and **inserts** the element at the correct position — like sorting playing cards in your hand.

I chose it for **departure time** because:
- Times like "06:00", "14:30" can be compared as strings (lexicographic order matches chronological order for HH:mm format)
- Insertion Sort is **efficient for nearly-sorted data** (best case O(n))
- Flight times in a day often come pre-arranged to some degree

### Q: Explain Merge Sort. Why for duration?
**A:** Merge Sort uses **divide-and-conquer**:
1. **Divide**: Split the list into two halves
2. **Conquer**: Recursively sort each half
3. **Merge**: Combine the two sorted halves into one sorted list

```
[120, 90, 150, 60] → [120, 90] + [150, 60]
                    → [90, 120] + [60, 150]
                    → [60, 90, 120, 150]  (merged)
```

I chose it for **duration** because:
- It guarantees **O(n log n)** in ALL cases (no worst-case degradation)
- Duration values can vary wildly (60-180 min), so we need a reliable sort
- It demonstrates the **recursive divide-and-conquer** paradigm

### Q: Explain Quick Sort. Why as an alternative for price?
**A:** Quick Sort picks a **pivot** element and **partitions** the array so that all smaller elements go left and all larger go right. Then it recursively sorts each partition.

I included it as an **alternative to Bubble Sort for price** so the student can compare:
- Bubble Sort: O(n²), simple, many swaps
- Quick Sort: O(n log n) average, faster, fewer swaps
- The frontend shows comparison counts, making the difference visible

### Q: Why did you pair specific algorithms with specific fields?
**A:**
| Field | Algorithm | Reason |
|-------|-----------|--------|
| Price | Bubble Sort | Simplest to implement; price is numeric |
| Price | Quick Sort | Faster alternative; demonstrates O(n log n) vs O(n²) |
| Departure Time | Insertion Sort | Good for partially sorted string data; intuitive "card sorting" analogy |
| Duration | Merge Sort | Guarantees O(n log n); shows recursion and divide-and-conquer |

This mapping ensures each algorithm is demonstrated with a field that makes pedagogical sense.

---

## 🔄 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND                           │
│  User clicks "Search" with source=Delhi, destination=Mumbai     │
│                            │                                    │
│  fetch("http://localhost:8080/api/flights/search               │
│         ?source=Delhi&destination=Mumbai")                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP GET
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SPRING BOOT BACKEND                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  FlightController (@RestController)                      │   │
│  │  @GetMapping("/search")                                  │   │
│  │  searchFlights(@RequestParam source, destination, date)  │   │
│  │         │                                                │   │
│  │         │ calls                                          │   │
│  │         ▼                                                │   │
│  │  FlightService (@Service)                                │   │
│  │  linearSearchByRoute(source, destination, date)          │   │
│  │         │                                                │   │
│  │         │  for (Flight f : flightList) {                 │   │
│  │         │    if (f.source matches && f.dest matches)     │   │
│  │         │      results.add(f);                           │   │
│  │         │  }                                             │   │
│  │         │                                                │   │
│  │         ▼                                                │   │
│  │  Returns List<Flight> as JSON                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ JSON Response
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND                           │
│  .then(data => setFlights(data))                                │
│  FlightTable renders the matching flights as cards/rows         │
└─────────────────────────────────────────────────────────────────┘
```

### Sort Request Flow (with Stats):
```
React: User picks sortBy=price, algorithm=bubble → clicks "Sort"
  │
  ▼
GET /api/flights/sort?sortBy=price&algorithm=bubble
  │
  ▼
FlightController.sortFlights(sortBy, algorithm)
  │
  ▼
FlightService.sortFlights("price", "bubble")
  │
  ├── Creates a COPY of the flight list
  ├── Records start time: System.nanoTime()
  ├── Runs bubbleSortByPrice() with comparison counter
  ├── Records end time
  ├── Builds SortResult:
  │     { flights: [...], algorithmUsed: "Bubble Sort",
  │       sortedBy: "price", comparisons: 378, timeTakenMs: 2 }
  │
  ▼
Returns SortResult as JSON → React renders flights + StatsStrip
```

### Booking Flow:
```
React: User clicks "Book" → enters name → clicks "Confirm"
  │
  ▼
POST /api/bookings  { flightId: "FL001", passengerName: "Rahul" }
  │
  ▼
BookingController.bookFlight(request)
  │
  ▼
FlightService.bookFlight("FL001", "Rahul")
  │
  ├── Linear search for flight by ID
  ├── Check availableSeats > 0 (else throw FlightException)
  ├── Decrement availableSeats
  ├── Generate PNR = "PNR" + random digits
  ├── Create Booking object
  ├── Store in bookingMap (HashMap)
  │
  ▼
Returns Booking { pnr: "PNR48273", ... } → React shows PNR to user
```

---

## 🧠 Key Concepts to Remember for Viva

### Data Structures Used
1. **ArrayList** — Stores all flights. Allows index-based access O(1), but search is O(n).
2. **HashMap** — Stores bookings by PNR key. Provides O(1) average-case lookup, insert, and delete.

### Why In-Memory Storage?
- This is a DSA demo, not a production system
- ArrayList and HashMap are the most fundamental data structures
- No database overhead — focus stays on algorithms

### Why Manual Sorting (No Collections.sort)?
- To **understand the algorithm internals** — every comparison, every swap
- To **count comparisons** and measure time for pedagogical comparison
- `Collections.sort()` uses TimSort internally (hybrid of Merge + Insertion sort) which hides the logic

### Stability in Sorting
- **Stable sort**: Equal elements maintain their relative order (Bubble, Insertion, Merge)
- **Unstable sort**: Equal elements may be reordered (Quick Sort)
- Example: Two flights at ₹5000 — a stable sort keeps their original order

### When to Use Which Search?
- **Linear Search**: When data is unsorted, when finding ALL matches, for small datasets
- **Binary Search**: When data is sorted, when finding ONE element or a boundary, for large datasets
- **HashMap**: When you have a unique key and need instant lookup

---

## 💡 Common Viva Questions

**Q: What happens if two flights have the same price during Quick Sort?**
A: They may end up in any order since Quick Sort is **unstable**. If we need to preserve original order, we'd use Merge Sort instead.

**Q: What's the space complexity difference between Merge Sort and Quick Sort?**
A: Merge Sort needs **O(n)** extra space for the temporary arrays during merging. Quick Sort only needs **O(log n)** for the recursive call stack (in-place partitioning).

**Q: Can Binary Search find ALL flights under a budget?**
A: We use Binary Search to find the **boundary index** — the last flight whose price ≤ budget in the sorted list. Then we return all flights from index 0 to that boundary. The search itself is O(log n), but returning k results takes O(k).

**Q: Why not use Binary Search for route search?**
A: Routes (source + destination) don't have a natural ordering. You can't say "Delhi-Mumbai" < "Chennai-Kolkata" in a meaningful way. Binary Search requires a **total ordering** on the search field.

**Q: What's the difference between Comparable and Comparator?**
A: We avoided both to keep it simple. Instead, we directly compare `flight.getPrice()` values using `>` and `<` operators, and `departureTime` strings using `.compareTo()`. In a real project, you'd implement `Comparable<Flight>` or pass `Comparator<Flight>` objects.
