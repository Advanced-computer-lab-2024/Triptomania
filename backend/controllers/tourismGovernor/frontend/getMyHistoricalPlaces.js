fetch(`http://localhost:5000/api/tourismGovernor/getMyHistoricalPlaces/${creatorId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.status) {
            resultsContainer.innerHTML = ''; // Clear previous results
            data.historicalPlaces.forEach(place => {
                const placeDiv = document.createElement('div');
                placeDiv.innerHTML = `
                    <h3>${place.Name}</h3>
                    <p>Description: ${place.Description}</p>
                    <p>Location: ${place.Location}</p>
                    <p>Opening Hours: ${place.Opening_hours}</p>
                    <p>Closing Hours: ${place.Closing_hours}</p>
                    <p>Ticket Prices: ${place.Ticket_prices}</p>
                    <p>Category: ${place.Category}</p>
                    <p>Tags: ${place.Tags.join(', ')}</p>
                `;
                resultsContainer.appendChild(placeDiv);
            });
        } else {
            resultsContainer.innerHTML = `<p>${data.error}</p>`;
        }
    })
    .catch(error => {
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
