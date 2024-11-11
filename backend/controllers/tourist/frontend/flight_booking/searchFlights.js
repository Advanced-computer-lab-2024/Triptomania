document.getElementById('searchFlightsForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departure_date = document.getElementById('departure_date').value;
    const return_date = document.getElementById('return_date').value || null;

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
});

function displayFlights(flights) {
    const flightsList = document.getElementById('flightsList');
    flightsList.innerHTML = '';

    flights.forEach(flight => {
        const flightElement = document.createElement('div');
        flightElement.className = 'flight';
        flightElement.innerHTML = `
            <p>Flight ID: ${flight.id}</p>
            <button onclick="getFlightDetails('${flight.id}')">View Details</button>
        `;
        flightsList.appendChild(flightElement);
    });
}

function getFlightDetails(flight_id) {
    window.location.href = `getFlightDetails.html?flight_id=${flight_id}`;
}