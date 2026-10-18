package com.dsa.flightreservation.model;

import java.util.List;

/**
 * Wrapper returned by sorting endpoints to supply the sorted flight list
 * alongside execution statistics (algorithm used, sort criterion, elapsed time, comparisons).
 */
public class SortResult {

    private List<Flight> flights;
    private String algorithmUsed;
    private String sortedBy;
    private long timeTakenMs;
    private long comparisons;

    public SortResult() {
    }

    public SortResult(List<Flight> flights, String algorithmUsed, String sortedBy, long timeTakenMs, long comparisons) {
        this.flights = flights;
        this.algorithmUsed = algorithmUsed;
        this.sortedBy = sortedBy;
        this.timeTakenMs = timeTakenMs;
        this.comparisons = comparisons;
    }

    public List<Flight> getFlights() {
        return flights;
    }

    public void setFlights(List<Flight> flights) {
        this.flights = flights;
    }

    public String getAlgorithmUsed() {
        return algorithmUsed;
    }

    public void setAlgorithmUsed(String algorithmUsed) {
        this.algorithmUsed = algorithmUsed;
    }

    public String getSortedBy() {
        return sortedBy;
    }

    public void setSortedBy(String sortedBy) {
        this.sortedBy = sortedBy;
    }

    public long getTimeTakenMs() {
        return timeTakenMs;
    }

    public void setTimeTakenMs(long timeTakenMs) {
        this.timeTakenMs = timeTakenMs;
    }

    public long getComparisons() {
        return comparisons;
    }

    public void setComparisons(long comparisons) {
        this.comparisons = comparisons;
    }

    @Override
    public String toString() {
        return "SortResult{" +
                "flightsCount=" + (flights != null ? flights.size() : 0) +
                ", algorithmUsed='" + algorithmUsed + '\'' +
                ", sortedBy='" + sortedBy + '\'' +
                ", timeTakenMs=" + timeTakenMs +
                ", comparisons=" + comparisons +
                '}';
    }
}
