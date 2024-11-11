document.getElementById('searchFlightsForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departure_date = document.getElementById('departure_date').value;
    const return_date = document.getElementById('return_date').value || null;

    try {
        const response = await fetch('http://localhost:5000/api/tourist/searchFlights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin, destination, departure_date, return_date })
        });

        const data = await response.json();

        if (data && data.length > 0) {
            displayFlights(data);
        } else {
            document.getElementById('flightsList').innerText = "No flights found.";
        }
    } catch (error) {
        console.error("Error fetching flight data:", error);
        document.getElementById('flightsList').innerText = "An error occurred while searching for flights.";
    }
});

function displayFlights(flights) {
    const flightsList = document.getElementById('flightsList');
    flightsList.innerHTML = '';

    flights.forEach(flight => {
        const flightElement = document.createElement('div');
        flightElement.className = 'flight';
        flightElement.innerHTML = `
            <h2>Flight ID: ${flight.id}</h2>
            <p><strong>Total Price:</strong> ${flight.price.total} ${flight.price.currency}</p>
            <p><strong>Fare Type:</strong> ${flight.pricingOptions.fareType.join(", ")}</p>
            <p><strong>Last Ticketing Date:</strong> ${flight.lastTicketingDate}</p>
            <p><strong>Seats Available:</strong> ${flight.numberOfBookableSeats}</p>

            <h3>Itineraries:</h3>
            ${flight.itineraries.map(itinerary => `
                <div class="itinerary">
                    <p><strong>Itinerary Duration:</strong> ${itinerary.duration}</p>
                    <h4>Segments:</h4>
                    ${itinerary.segments.map(segment => `
                        <div class="segment">
                            <p><strong>Flight Number:</strong> ${segment.carrierCode} ${segment.number}</p>
                            <p><strong>Aircraft:</strong> ${segment.aircraft.code}</p>
                            <p><strong>Departure:</strong> ${segment.departure.iataCode} 
                                Terminal ${segment.departure.terminal}, 
                                at ${new Date(segment.departure.at).toLocaleString()}</p>
                            <p><strong>Arrival:</strong> ${segment.arrival.iataCode} 
                                Terminal ${segment.arrival.terminal || 'N/A'}, 
                                at ${new Date(segment.arrival.at).toLocaleString()}</p>
                            <p><strong>Segment Duration:</strong> ${segment.duration}</p>
                            <p><strong>Stops:</strong> ${segment.numberOfStops}</p>
                        </div>
                    `).join('')}
                </div>
            `).join('')}

            <h3>Traveler Pricing:</h3>
            ${flight.travelerPricings.map(pricing => `
                <div class="pricing">
                    <p><strong>Traveler Type:</strong> ${pricing.travelerType}</p>
                    <p><strong>Cabin:</strong> ${pricing.fareDetailsBySegment.map(fd => fd.cabin).join(", ")}</p>
                    <p><strong>Class:</strong> ${pricing.fareDetailsBySegment.map(fd => fd.class).join(", ")}</p>
                    <p><strong>Included Checked Bags:</strong> ${pricing.fareDetailsBySegment.map(fd => fd.includedCheckedBags.quantity || 0).join(", ")}</p>
                    
                </div>
            `).join('')}
            
            <button onclick="getFlightDetails('${flight.id}')">View Details</button>
        `;
        flightsList.appendChild(flightElement);
    });
}

function getFlightDetails(flight_id) {
    window.location.href = `getFlightDetails.html?flight_id=${flight_id}`;
}
