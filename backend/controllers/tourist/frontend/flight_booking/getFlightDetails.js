// Function to extract query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Get the flight_id from the URL
const flight_id = getQueryParam('flight_id');

// Fetch and display flight details
async function fetchFlightDetails(flight_id) {
  if (!flight_id) {
      document.getElementById('flightDetails').innerText = "No flight ID provided.";
      return;
  }

  try {
      const response = await fetch(`http://localhost:5000/api/tourist/getFlightDetails/${flight_id}`);
      
      const data = await response.json();
      console.log(data.flightOffers);
      const flightDetailsContainer = document.getElementById('flightDetails');
      if (data) {
          flightDetailsContainer.innerHTML = `
              <h2>Flight Details</h2>
              <p>Price: ${data.flightOffers[0].price.total} ${data.flightOffers[0].price.currency}</p>
              <p>Departure: ${data.flightOffers[0].itineraries[0].segments[0].departure.iataCode} - ${data.flightOffers[0].itineraries[0].segments[0].departure.at}</p>
              <p>Arrival: ${data.flightOffers[0].itineraries[0].segments[0].arrival.iataCode} - ${data.flightOffers[0].itineraries[0].segments[0].arrival.at}</p>
              <button onclick="bookFlight('${flight_id}')">Book Flight</button>
          `;
      } else {
          flightDetailsContainer.innerHTML = "Flight details not found.";
      }
  } catch (error) {
      console.error('Error fetching flight details:', error);
      document.getElementById('flightDetails').innerText = "Failed to fetch flight details.";
  }
}

// Initialize fetching of flight details
fetchFlightDetails(flight_id);

// Define bookFlight function to handle the booking button click
function bookFlight(flight_id) {
  window.location.href = `bookFlight.html?flight_id=${flight_id}`;
}
