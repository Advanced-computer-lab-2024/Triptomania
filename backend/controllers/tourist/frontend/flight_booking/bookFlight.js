// Extract flight_id from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const flight_id = getQueryParam('flight_id');

// Handle form submission to book the flight
document.getElementById('bookFlightForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const touristId = document.getElementById('touristId').value;

    // Collect document details from form inputs
    const documentData = {
        documentType: document.getElementById('documentType').value,
        birthPlace: document.getElementById('birthPlace').value,
        issuanceLocation: document.getElementById('issuanceLocation').value,
        issuanceDate: document.getElementById('issuanceDate').value,
        number: document.getElementById('documentNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        issuanceCountry: document.getElementById('issuanceCountry').value,
        validityCountry: document.getElementById('validityCountry').value,
        nationality: document.getElementById('nationality').value,
        holder: document.getElementById('holder').checked
    };

    // Set up booking data
    const bookingData = {
        flight_offer: flight_id,
        documents: [documentData]
    };

    // Send booking request to server
    try {
        const response = await fetch(`http://localhost:5000/api/tourist/bookFlight/${touristId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        // Display booking result to user
        const bookingResult = document.getElementById('bookingResult');
        if (response.ok) {
            bookingResult.innerHTML = `<p>Flight booked successfully! Booking ID: ${result.id}</p>`;
        } else {
            bookingResult.innerHTML = `<p>Error booking flight: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Error booking flight:', error);
        document.getElementById('bookingResult').innerText = "Failed to book flight.";
    }
});
