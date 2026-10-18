package com.dsa.flightreservation.model;

/**
 * Model representing a Booking record in the reservation system.
 */
public class Booking {

    private String pnr;
    private String flightId;
    private String flightNumber;
    private String passengerName;
    private String bookingDate;

    public Booking() {
    }

    public Booking(String pnr, String flightId, String flightNumber, String passengerName, String bookingDate) {
        this.pnr = pnr;
        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.passengerName = passengerName;
        this.bookingDate = bookingDate;
    }

    public String getPnr() {
        return pnr;
    }

    public void setPnr(String pnr) {
        this.pnr = pnr;
    }

    public String getFlightId() {
        return flightId;
    }

    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "pnr='" + pnr + '\'' +
                ", flightId='" + flightId + '\'' +
                ", flightNumber='" + flightNumber + '\'' +
                ", passengerName='" + passengerName + '\'' +
                ", bookingDate='" + bookingDate + '\'' +
                '}';
    }
}
