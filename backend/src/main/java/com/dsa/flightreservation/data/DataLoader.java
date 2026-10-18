package com.dsa.flightreservation.data;

import com.dsa.flightreservation.model.Flight;
import com.dsa.flightreservation.service.FlightService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Preloads realistic Indian domestic flight data upon application startup.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final FlightService flightService;

    public DataLoader(FlightService flightService) {
        this.flightService = flightService;
    }

    @Override
    public void run(String... args) {
        // Flight 1: Delhi -> Mumbai (IndiGo)
        flightService.addFlight(new Flight(
                "FL001", "6E-2041", "IndiGo", "Delhi", "Mumbai",
                "2026-10-20", "06:00", "08:15", 135, 4500.0, 45
        ));

        // Flight 2: Delhi -> Mumbai (Air India)
        flightService.addFlight(new Flight(
                "FL002", "AI-805", "Air India", "Delhi", "Mumbai",
                "2026-10-20", "08:00", "10:10", 130, 5200.0, 30
        ));

        // Flight 3: Delhi -> Mumbai (Vistara)
        flightService.addFlight(new Flight(
                "FL003", "UK-953", "Vistara", "Delhi", "Mumbai",
                "2026-10-20", "10:30", "12:45", 135, 6800.0, 25
        ));

        // Flight 4: Delhi -> Bangalore (SpiceJet)
        flightService.addFlight(new Flight(
                "FL004", "SG-8169", "SpiceJet", "Delhi", "Bangalore",
                "2026-10-20", "07:15", "10:05", 170, 5800.0, 50
        ));

        // Flight 5: Mumbai -> Bangalore (Akasa Air)
        flightService.addFlight(new Flight(
                "FL005", "QP-1311", "Akasa Air", "Mumbai", "Bangalore",
                "2026-10-20", "09:45", "11:30", 105, 3400.0, 60
        ));

        // Flight 6: Bangalore -> Delhi (IndiGo)
        flightService.addFlight(new Flight(
                "FL006", "6E-518", "IndiGo", "Bangalore", "Delhi",
                "2026-10-21", "06:30", "09:20", 170, 5500.0, 40
        ));

        // Flight 7: Mumbai -> Chennai (Air India)
        flightService.addFlight(new Flight(
                "FL007", "AI-657", "Air India", "Mumbai", "Chennai",
                "2026-10-21", "11:15", "13:10", 115, 4200.0, 35
        ));

        // Flight 8: Delhi -> Hyderabad (Vistara)
        flightService.addFlight(new Flight(
                "FL008", "UK-837", "Vistara", "Delhi", "Hyderabad",
                "2026-10-21", "14:00", "16:15", 135, 4900.0, 20
        ));

        // Flight 9: Kolkata -> Delhi (IndiGo)
        flightService.addFlight(new Flight(
                "FL009", "6E-243", "IndiGo", "Kolkata", "Delhi",
                "2026-10-21", "16:45", "19:15", 150, 4800.0, 55
        ));

        // Flight 10: Mumbai -> Goa (SpiceJet)
        flightService.addFlight(new Flight(
                "FL010", "SG-376", "SpiceJet", "Mumbai", "Goa",
                "2026-10-21", "12:30", "13:40", 70, 2800.0, 15
        ));

        // Flight 11: Bangalore -> Pune (Akasa Air)
        flightService.addFlight(new Flight(
                "FL011", "QP-1120", "Akasa Air", "Bangalore", "Pune",
                "2026-10-22", "08:20", "09:45", 85, 3100.0, 42
        ));

        // Flight 12: Hyderabad -> Bangalore (IndiGo)
        flightService.addFlight(new Flight(
                "FL012", "6E-7201", "IndiGo", "Hyderabad", "Bangalore",
                "2026-10-22", "10:00", "11:15", 75, 2900.0, 80
        ));

        // Flight 13: Delhi -> Chennai (Vistara)
        flightService.addFlight(new Flight(
                "FL013", "UK-879", "Vistara", "Delhi", "Chennai",
                "2026-10-22", "06:40", "09:35", 175, 6200.0, 18
        ));

        // Flight 14: Chennai -> Kolkata (Air India)
        flightService.addFlight(new Flight(
                "FL014", "AI-542", "Air India", "Chennai", "Kolkata",
                "2026-10-22", "13:20", "15:45", 145, 5100.0, 28
        ));

        // Flight 15: Ahmedabad -> Mumbai (IndiGo)
        flightService.addFlight(new Flight(
                "FL015", "6E-992", "IndiGo", "Ahmedabad", "Mumbai",
                "2026-10-22", "15:00", "16:15", 75, 2600.0, 65
        ));

        // Flight 16: Jaipur -> Delhi (SpiceJet)
        flightService.addFlight(new Flight(
                "FL016", "SG-102", "SpiceJet", "Jaipur", "Delhi",
                "2026-10-23", "07:30", "08:30", 60, 2500.0, 30
        ));

        // Flight 17: Delhi -> Pune (Vistara)
        flightService.addFlight(new Flight(
                "FL017", "UK-995", "Vistara", "Delhi", "Pune",
                "2026-10-23", "17:30", "19:40", 130, 5400.0, 22
        ));

        // Flight 18: Mumbai -> Kolkata (IndiGo)
        flightService.addFlight(new Flight(
                "FL018", "6E-634", "IndiGo", "Mumbai", "Kolkata",
                "2026-10-23", "05:50", "08:35", 165, 5900.0, 50
        ));

        // Flight 19: Delhi -> Goa (Air India)
        flightService.addFlight(new Flight(
                "FL019", "AI-441", "Air India", "Delhi", "Goa",
                "2026-10-23", "10:15", "12:55", 160, 7500.0, 32
        ));

        // Flight 20: Bangalore -> Ahmedabad (Akasa Air)
        flightService.addFlight(new Flight(
                "FL020", "QP-1522", "Akasa Air", "Bangalore", "Ahmedabad",
                "2026-10-23", "14:10", "16:25", 135, 4100.0, 48
        ));

        // Flight 21: Hyderabad -> Goa (IndiGo)
        flightService.addFlight(new Flight(
                "FL021", "6E-401", "IndiGo", "Hyderabad", "Goa",
                "2026-10-24", "09:05", "10:25", 80, 3300.0, 38
        ));

        // Flight 22: Kolkata -> Bangalore (Vistara)
        flightService.addFlight(new Flight(
                "FL022", "UK-772", "Vistara", "Kolkata", "Bangalore",
                "2026-10-24", "11:40", "14:15", 155, 6400.0, 16
        ));

        // Flight 23: Pune -> Delhi (SpiceJet)
        flightService.addFlight(new Flight(
                "FL023", "SG-298", "SpiceJet", "Pune", "Delhi",
                "2026-10-24", "19:00", "21:10", 130, 4700.0, 25
        ));

        // Flight 24: Mumbai -> Jaipur (Air India)
        flightService.addFlight(new Flight(
                "FL024", "AI-887", "Air India", "Mumbai", "Jaipur",
                "2026-10-24", "15:30", "17:15", 105, 3800.0, 27
        ));

        // Flight 25: Delhi -> Ahmedabad (IndiGo)
        flightService.addFlight(new Flight(
                "FL025", "6E-311", "IndiGo", "Delhi", "Ahmedabad",
                "2026-10-25", "08:45", "10:20", 95, 3600.0, 52
        ));

        // Flight 26: Bangalore -> Mumbai (Vistara)
        flightService.addFlight(new Flight(
                "FL026", "UK-812", "Vistara", "Bangalore", "Mumbai",
                "2026-10-25", "18:20", "20:05", 105, 4600.0, 19
        ));

        // Flight 27: Delhi -> Bangalore (Air India)
        flightService.addFlight(new Flight(
                "FL027", "AI-506", "Air India", "Delhi", "Bangalore",
                "2026-10-25", "13:00", "15:45", 165, 6100.0, 34
        ));

        // Flight 28: Chennai -> Hyderabad (IndiGo)
        flightService.addFlight(new Flight(
                "FL028", "6E-208", "IndiGo", "Chennai", "Hyderabad",
                "2026-10-25", "20:10", "21:25", 75, 2750.0, 44
        ));

        // Flight 29: Goa -> Delhi (SpiceJet)
        flightService.addFlight(new Flight(
                "FL029", "SG-704", "SpiceJet", "Goa", "Delhi",
                "2026-10-25", "16:30", "19:10", 160, 7900.0, 12
        ));

        // Flight 30: Mumbai -> Delhi (Akasa Air)
        flightService.addFlight(new Flight(
                "FL030", "QP-1384", "Akasa Air", "Mumbai", "Delhi",
                "2026-10-25", "21:00", "23:15", 135, 4300.0, 58
        ));
    }
}
