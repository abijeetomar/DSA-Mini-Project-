# ✈️ Flight Reservation System — DSA Mini Project

[![Java](https://img.shields.io/badge/Java-17-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A full-stack **Flight Reservation System** built for a **Data Structures & Algorithms (DSA)** course. It features **manual, loop-based implementations** of fundamental searching and sorting algorithms (without relying on `Collections.sort()` or Java streams) with real-time algorithm benchmarking (comparisons counter & execution time in milliseconds).

---

## 📌 Project Overview

This project bridges theoretical computer science concepts with modern full-stack web development. Instead of using black-box library utilities (`Arrays.sort()` or `Collections.sort()`), every search and sort routine is written with **plain loops and manual pointer manipulation**, making every line easily explainable in viva exams and technical interviews.

### Key Highlights
- **100% In-Memory Storage**: Built purely with core data structures (`ArrayList` and `HashMap`) — no relational databases, SQL, or ORM overhead.
- **Manual DSA Algorithms**: Custom implementations of Linear Search, Binary Search, Bubble Sort, Insertion Sort, Merge Sort, and Quick Sort.
- **Live Algorithm Benchmark**: Frontend displays real-time comparison counts and execution time ($ms$) for each sorting algorithm.
- **Realistic Seed Data**: Automatically preloads 30 realistic Indian domestic flights (IndiGo, Air India, Vistara, Akasa Air, SpiceJet) across major metropolitan airports upon startup.
- **Clean Modern UI**: Built with React, Vite, and Tailwind CSS with responsive flight cards, booking modals, and PNR lookup.

---

## 🧠 Data Structures & Algorithms Implementation

### 1. Algorithm Complexity Matrix

| Algorithm | Type | Target Field | Best Time | Average Time | Worst Time | Space | Stable? | Viva Concept |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Search** | Search | Route & Airline | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | — | Sequential scan; works on unsorted multi-match data |
| **Binary Search** | Search | Price Budget ($\le X$) | $\mathcal{O}(1)$ | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ | $\mathcal{O}(1)$ | — | Divide-and-conquer; requires sorted data |
| **HashMap Lookup** | Search | Booking PNR | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(n)^*$ | $\mathcal{O}(n)$ | — | Key-to-bucket hashing for instantaneous lookup |
| **Bubble Sort** | Sort | Price | $\mathcal{O}(n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ | **Yes** | Adjacent swaps; early termination flag |
| **Insertion Sort** | Sort | Departure Time | $\mathcal{O}(n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ | **Yes** | Card-sorting analogy; efficient for partially ordered data |
| **Merge Sort** | Sort | Duration | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n)$ | **Yes** | Recursive divide-and-conquer; guaranteed upper bound |
| **Quick Sort** | Sort | Price (Alternative) | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n \log n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(\log n)$ | **No** | In-place Lomuto partitioning; minimal memory overhead |

*\* Note: HashMap worst-case $\mathcal{O}(n)$ occurs only under pathological hash collisions. In standard execution, it operates in amortized $\mathcal{O}(1)$.*

---

### 2. Why Each Algorithm Was Mapped to Each Field

- **Route Search $\rightarrow$ Linear Search ($\mathcal{O}(n)$)**  
  Routes (e.g. `Delhi` $\rightarrow$ `Mumbai`) have no natural 1D scalar ordering. Because we need to find *all* flights matching the origin and destination, a linear scan across the `ArrayList` is optimal and intuitive.
- **Budget Filter $\rightarrow$ Binary Search ($\mathcal{O}(\log n)$)**  
  Binary search requires sorted input. The system sorts a clone of the flights list by price, then applies binary search to find the rightmost flight within the user's budget (`price <= maxPrice`), returning all qualifying flights from index `0` to that boundary in logarithmic time.
- **Booking Retrieval $\rightarrow$ HashMap ($\mathcal{O}(1)$)**  
  When a user books a flight, a unique 6-character PNR is generated and stored in a Java `HashMap<String, Booking>`. Looking up or cancelling a reservation by PNR runs in constant time $\mathcal{O}(1)$ without scanning the flight database.
- **Price $\rightarrow$ Bubble Sort vs. Quick Sort**  
  Implementing two distinct algorithms on the exact same numeric field (`price`) allows a direct pedagogical comparison on the frontend stats strip: users can witness Quick Sort completing in significantly fewer comparisons than Bubble Sort.
- **Departure Time $\rightarrow$ Insertion Sort**  
  Departure times are formatted as standard `"HH:mm"` strings (`"06:00"`, `"14:30"`). Lexicographical comparison matches chronological order. Insertion Sort excels here because flights scheduled across a day are often already nearly-sorted.
- **Flight Duration $\rightarrow$ Merge Sort**  
  Duration values vary widely (60 to 185 minutes). Merge Sort demonstrates recursive divide-and-conquer with a guaranteed $\mathcal{O}(n \log n)$ complexity in all cases, while preserving the relative order of flights with identical durations (stability).

---

## 🏗️ System Architecture & Request Flow

```
+-----------------------------------------------------------------------------------+
| 1. React Frontend (Browser - http://localhost:5173)                               |
|    User selects: Source="Delhi", Destination="Mumbai"                             |
|    Calls: searchFlights("Delhi", "Mumbai") in src/api.js                          |
+------------------------------------------+----------------------------------------+
                                           | HTTP GET /api/flights/search
                                           v
+-----------------------------------------------------------------------------------+
| 2. Spring Boot Controller (FlightController.java)                                 |
|    @GetMapping("/search")                                                         |
|    Delegates to: flightService.linearSearchByRoute(source, destination, date)     |
+------------------------------------------+----------------------------------------+
                                           | Method Invocation
                                           v
+-----------------------------------------------------------------------------------+
| 3. Service Layer Manual DSA Engine (FlightService.java)                           |
|    - Performs manual loop inspection over ArrayList<Flight>                       |
|    - Collects all matching records without using streams or helper libraries      |
+------------------------------------------+----------------------------------------+
                                           | Returns List<Flight>
                                           v
+-----------------------------------------------------------------------------------+
| 4. Jackson Serialization & HTTP Response                                          |
|    Returns JSON payload with HTTP 200 OK                                          |
+------------------------------------------+----------------------------------------+
                                           | JSON Payload
                                           v
+-----------------------------------------------------------------------------------+
| 5. React UI Re-render                                                             |
|    FlightTable updates with flight cards, seat counters, and Book buttons         |
+-----------------------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.5 (`spring-boot-starter-web`)
- **Build Tool**: Apache Maven
- **Architecture**: Controller-Service-Model with centralized `@RestControllerAdvice`
- **Data Storage**: In-Memory (`java.util.ArrayList`, `java.util.HashMap`)

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Fetch API
- **Design**: Responsive card grid, benchmark metrics strip, modal dialogs, and PNR verification panel

---

## 📂 Project Directory Structure

```
flight-reservation-system/
├── backend/                                  # Spring Boot Application
│   ├── pom.xml                               # Maven project dependencies
│   └── src/main/
│       ├── resources/
│       │   └── application.properties        # Port 8080 configuration
│       └── java/com/dsa/flightreservation/
│           ├── FlightReservationApplication.java   # Main application entry point
│           ├── config/
│           │   └── CorsConfig.java           # Cross-Origin Resource Sharing for Vite
│           ├── controller/
│           │   ├── BookingController.java    # /api/bookings endpoints
│           │   └── FlightController.java     # /api/flights endpoints
│           ├── data/
│           │   └── DataLoader.java           # Preloads 30 realistic domestic flights
│           ├── exception/
│           │   ├── FlightException.java      # Custom runtime domain exception
│           │   └── GlobalExceptionHandler.java # HTTP 400 Bad Request error handler
│           ├── model/
│           │   ├── Booking.java              # Booking entity (PNR, Passenger, Date)
│           │   ├── Flight.java               # Flight entity (11 domain fields)
│           │   └── SortResult.java           # DTO with flights + algorithm metrics
│           └── service/
│               └── FlightService.java        # ⭐ ALL DSA algorithms & business logic
│
├── frontend/                                 # React + Vite Frontend
│   ├── package.json                          # Dependencies & build scripts
│   ├── vite.config.js                        # Vite configuration (port 5173)
│   ├── index.html                            # Application shell
│   └── src/
│       ├── main.jsx                          # React entry point
│       ├── index.css                         # Tailwind CSS imports
│       ├── api.js                            # Fetch abstraction for backend APIs
│       ├── App.jsx                           # Main layout & component state
│       └── components/
│           ├── BookingCheck.jsx              # PNR verification & cancellation (O(1))
│           ├── BookingModal.jsx              # Passenger booking dialog & PNR output
│           ├── FlightTable.jsx               # Flight listings & seat counters
│           ├── SearchForm.jsx                # Linear & Binary search controls
│           ├── SortControls.jsx              # Algorithm & sorting criterion picker
│           └── StatsStrip.jsx                # Real-time algorithm benchmark stats
│
└── VIVA_NOTES.md                             # Comprehensive Viva & Interview preparation
```

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK)**: Version 17 or higher
- **Apache Maven**: Version 3.8+ (or IntelliJ IDEA bundled Maven)
- **Node.js**: Version 18+ and `npm`

---

### Step 1: Run Backend (Spring Boot)

Open a terminal and navigate to the backend directory:

```bash
cd backend

# Compile and start Spring Boot
mvn spring-boot:run
```

*The backend server will start at **`http://localhost:8080`** and preload 30 flights.*

> **Using IntelliJ IDEA?**  
> 1. Open the `flight-reservation-system/backend` folder in IntelliJ.  
> 2. Right-click `pom.xml` and select **Add as Maven Project**.  
> 3. Open `FlightReservationApplication.java` and click the green **▶ Run** icon.

---

### Step 2: Run Frontend (React + Vite)

Open a second terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

*The frontend will launch at **`http://localhost:5173`**. Open this URL in your web browser.*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Algorithm Used |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/flights` | Retrieve all 30 flights | $O(1)$ collection copy |
| `GET` | `/api/flights/search?source=&destination=&date=` | Search flights by origin, destination, and optional date | **Linear Search** $\mathcal{O}(n)$ |
| `GET` | `/api/flights/search/airline?airline=` | Search flights matching airline name | **Linear Search** $\mathcal{O}(n)$ |
| `GET` | `/api/flights/budget?maxPrice=` | Find flights within budget | **Binary Search** $\mathcal{O}(\log n)$ on sorted list |
| `GET` | `/api/flights/sort?sortBy=&algorithm=` | Sort flights by criteria (`price`, `departureTime`, `duration`) using algorithm (`bubble`, `insertion`, `merge`, `quick`) | **Manual Sorting** ($\mathcal{O}(n^2)$ or $\mathcal{O}(n \log n)$) |
| `POST` | `/api/bookings` | Book a seat (`{flightId, passengerName}`) | Decrements seat, generates PNR |
| `GET` | `/api/bookings/{pnr}` | Retrieve booking information by PNR | **HashMap Lookup** $\mathcal{O}(1)$ |
| `DELETE` | `/api/bookings/{pnr}` | Cancel booking and release seat back to flight | **HashMap Remove** $\mathcal{O}(1)$ |

---

## 🎓 Viva & Exam Q&A Quick Reference

### Q1: Why did you implement sorting manually instead of using `Collections.sort()`?
> **Answer**: `Collections.sort()` uses **TimSort** (a hybrid of Merge Sort and Insertion Sort), which abstracts away internal operations. Manual implementation with plain loops allows us to inspect, explain, and count every comparison and swap, and benchmark algorithm performance directly.

### Q2: Why does Binary Search require sorted data?
> **Answer**: Binary Search relies on the **order property** of the data. By comparing the target with the middle element, it eliminates half of the remaining search space. If the data is unsorted, discarding either half could discard valid elements.

### Q3: What is sorting stability and which algorithms here are stable?
> **Answer**: A sorting algorithm is **stable** if elements with identical keys appear in the same relative order in the output as they did in the input. In our project:
> - **Stable**: Bubble Sort, Insertion Sort, Merge Sort
> - **Unstable**: Quick Sort (due to long-range partition swaps)

### Q4: What is the space complexity difference between Merge Sort and Quick Sort?
> **Answer**: 
> - **Merge Sort** requires $\mathcal{O}(n)$ auxiliary memory to create temporary sub-arrays during merging.
> - **Quick Sort** partitions elements in-place within the array, requiring only $\mathcal{O}(\log n)$ auxiliary space on the recursion call stack.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE). Feel free to use it for academic coursework, viva preparation, and learning DSA concepts.
