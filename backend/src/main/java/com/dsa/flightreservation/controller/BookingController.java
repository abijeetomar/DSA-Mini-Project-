package com.dsa.flightreservation.controller;

import com.dsa.flightreservation.model.Booking;
import com.dsa.flightreservation.service.FlightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller managing flight reservations, PNR lookups, and cancellations.
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final FlightService flightService;

    public BookingController(FlightService flightService) {
        this.flightService = flightService;
    }

    /**
     * DTO for booking requests.
     */
    public static class BookingRequest {
        private String flightId;
        private String passengerName;

        public BookingRequest() {
        }

        public BookingRequest(String flightId, String passengerName) {
            this.flightId = flightId;
            this.passengerName = passengerName;
        }

        public String getFlightId() {
            return flightId;
        }

        public void setFlightId(String flightId) {
            this.flightId = flightId;
        }

        public String getPassengerName() {
            return passengerName;
        }

        public void setPassengerName(String passengerName) {
            this.passengerName = passengerName;
        }
    }

    /**
     * POST /api/bookings
     * Creates a new booking, decrements seats, and returns the booking with generated PNR.
     */
    @PostMapping
    public ResponseEntity<Booking> bookFlight(@RequestBody BookingRequest request) {
        Booking booking = flightService.bookFlight(request.getFlightId(), request.getPassengerName());
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /**
     * GET /api/bookings/{pnr}
     * O(1) HashMap lookup of a booking by PNR.
     */
    @GetMapping("/{pnr}")
    public ResponseEntity<Booking> getBooking(@PathVariable String pnr) {
        Booking booking = flightService.getBooking(pnr);
        return ResponseEntity.ok(booking);
    }

    /**
     * DELETE /api/bookings/{pnr}
     * Cancels a booking, increments seat count, and returns the cancelled booking record.
     */
    @DeleteMapping("/{pnr}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String pnr) {
        Booking cancelledBooking = flightService.cancelBooking(pnr);
        return ResponseEntity.ok(cancelledBooking);
    }
}
