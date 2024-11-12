let lastFetchedItineraries = []; // Store itineraries data

// Fetch itineraries from the server
async function fetchItineraries() {
    try {
        const response = await fetch('http://localhost:5000/api/tourist/itineraries/viewItineraries');
        if (!response.ok) {
            throw new Error('Failed to fetch itineraries');
        }
        const data = await response.json();
        lastFetchedItineraries = data.itineraries;
        displayItineraries(data.itineraries); // Display all itineraries
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error loading itineraries: " + error.message;
    }
}

// Display itineraries on the page
function displayItineraries(itineraries) {
    const itineraryList = document.getElementById('itineraryList');
    itineraryList.innerHTML = ''; // Clear previous itineraries

    itineraries.forEach(itinerary => {
        const itineraryItem = document.createElement('div');
        itineraryItem.classList.add('itinerary-item');
        itineraryItem.innerHTML = `
            <h3>${itinerary.Name}</h3>
            <p>Price: $${itinerary.price}</p>
            <p>Duration: ${itinerary.duration}</p>
            <p>Language: ${itinerary.language}</p>
            <p>Available Dates: ${itinerary.availableDates.join(', ')}</p>
            <p>Tags: ${itinerary.Tags.join(', ')}</p>
            <p>Rating: ${itinerary.averageRating}</p>
        `;

        itineraryList.appendChild(itineraryItem);
    });
}

// Filter itineraries based on criteria
document.getElementById('filterButton').addEventListener('click', async function () {
    const budget = document.getElementById('budgetFilter').value;
    const date = document.getElementById('dateFilter').value;
    // const preferences = document.getElementById('preferencesFilter').selectedOptions;
    const language = document.getElementById('languageFilter').value;

    // const preferencesArray = [];
    // for (let option of preferences) {
    //     preferencesArray.push(option.value);
    // }

    const filters = new URLSearchParams();
    if (budget) filters.append('budget', budget);
    if (date) filters.append('date', date);
    // if (preferencesArray.length) filters.append('preferences', preferencesArray.join(','));
    if (language) filters.append('language', language);

    try {
        const response = await fetch(`http://localhost:5000/api/tourist/filterItineraries?${filters}`);
        if (!response.ok) {
            throw new Error("Failed to filter itineraries");
        }
        const filteredItineraries = await response.json();
        displayItineraries(filteredItineraries); // Display filtered itineraries
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error filtering itineraries: " + error.message;
    }
});

// Sort itineraries by selected criteria
document.getElementById('sortButton').addEventListener('click', async function () {
    const sortBy = document.getElementById('sortBySelect').value;
    const order = document.getElementById('sortOrderSelect').value;

    const params = new URLSearchParams({ sortBy, order });

    try {
        const response = await fetch(`http://localhost:5000/api/tourist/itineraries/sortItineraries?${params}`);
        if (!response.ok) {
            throw new Error("Failed to sort itineraries");
        }
        const sortedItineraries = await response.json();
        displayItineraries(sortedItineraries); // Show sorted itineraries
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error sorting itineraries: " + error.message;
    }
});

// Load all itineraries when the page is loaded
window.onload = fetchItineraries;
