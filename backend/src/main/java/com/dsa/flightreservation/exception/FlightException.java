package com.dsa.flightreservation.exception;

/**
 * Custom runtime exception for flight reservation domain and algorithm errors.
 */
public class FlightException extends RuntimeException {

    public FlightException(String message) {
        super(message);
    }

    public FlightException(String message, Throwable cause) {
        super(message, cause);
    }
}
