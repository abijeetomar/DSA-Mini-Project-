package com.dsa.flightreservation.controller;

import com.dsa.flightreservation.model.Flight;
import com.dsa.flightreservation.model.SortResult;
import com.dsa.flightreservation.service.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller handling flight retrieval, linear search, binary search,
 * and custom DSA sorting endpoints.
 */
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    /**
     * GET /api/flights
     * Returns the full list of available flights.
     */
    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        return ResponseEntity.ok(flightService.getAllFlights());
    }

    /**
     * GET /api/flights/search?source=&destination=&date=
     * Performs linear search to find flights matching the route and optional date.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(required = false) String date) {
        List<Flight> results = flightService.linearSearchByRoute(source, destination, date);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/flights/search/airline?airline=
     * Performs linear search to find flights matching an airline name.
     */
    @GetMapping("/search/airline")
    public ResponseEntity<List<Flight>> searchByAirline(@RequestParam String airline) {
        List<Flight> results = flightService.linearSearchByAirline(airline);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/flights/sort?sortBy=&algorithm=
     * Sorts flights using custom DSA sorting algorithms (bubble, insertion, merge, quick).
     * Returns a SortResult wrapper containing sorted flights, algorithm name, time taken, and comparison count.
     */
    @GetMapping("/sort")
    public ResponseEntity<SortResult> sortFlights(
            @RequestParam String sortBy,
            @RequestParam String algorithm) {
        SortResult result = flightService.sortFlights(sortBy, algorithm);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/flights/budget?maxPrice=
     * Uses binary search on a sorted copy of flights to retrieve all flights within budget.
     */
    @GetMapping("/budget")
    public ResponseEntity<List<Flight>> searchByBudget(@RequestParam double maxPrice) {
        List<Flight> results = flightService.binarySearchByBudget(maxPrice);
        return ResponseEntity.ok(results);
    }
}
