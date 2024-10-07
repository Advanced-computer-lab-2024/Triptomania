// Fetch all itineraries and populate the table
async function fetchAllItineraries() {
    try {
        const response = await fetch('http://localhost:5000/api/itineraries/getAllItineraries'); // Change the URL to match your API
        if (response.ok) {
            const itineraries = await response.json();
            populateItinerariesTable(itineraries);
        } else {
            throw new Error('Error fetching itineraries');
        }
    } catch (error) {
        console.error('Error fetching itineraries:', error);
    }
}

// Populate the itineraries table with the fetched itineraries
function populateItinerariesTable(itineraries) {
    const tableBody = document.getElementById('itinerariesTableBody');
    tableBody.innerHTML = ''; // Clear the table before populating

    itineraries.forEach(itinerary => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${itinerary.activities.join(', ')}</td>
            <td>${itinerary.locationsToVisit.join(', ')}</td>
            <td>${itinerary.timeline}</td>
            <td>${itinerary.duration}</td>
            <td>${itinerary.language}</td>
            <td>${itinerary.price}</td>
            <td>${itinerary.availableDates.join(', ')}</td>
            <td>${itinerary.availableTimes.join(', ')}</td>
            <td>${itinerary.accessibility ? 'Yes' : 'No'}</td>
            <td>${itinerary.pickUpLocation}</td>
            <td>${itinerary.dropOffLocation}</td>
            <td>
                <button onclick="editItinerary('${itinerary._id}')">Edit</button>
                <button onclick="deleteItinerary('${itinerary._id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to handle editing an itinerary
function editItinerary(itineraryId) {
    window.location.href = `manageItinerary.html?id=${itineraryId}`;
}

// Function to handle deleting an itinerary
async function deleteItinerary(itineraryId) {
    const confirmDelete = confirm('Are you sure you want to delete this itinerary?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:5000/api/admin/itineraries/deleteItinerary/${itineraryId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Itinerary deleted successfully');
            fetchAllItineraries(); // Refresh the table after deletion
        } else {
            alert('Error deleting itinerary');
        }
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        alert('Error deleting itinerary. Check console for details.');
    }
}

// Function to fetch itinerary details by its ID
async function fetchItineraryById(itineraryId) {
    try {
        const response = await fetch(`http://localhost:5000/api/itineraries/viewItinerary/${itineraryId}`);
        if (response.ok) {
            const itinerary = await response.json();
            displayItineraryDetails(itinerary);
        } else {
            alert('Itinerary not found');
        }
    } catch (error) {
        console.error('Error fetching itinerary:', error);
    }
}

// Function to display fetched itinerary details
function displayItineraryDetails(itinerary) {
    document.getElementById('itineraryDetails').style.display = 'block';
    document.getElementById('itineraryActivities').innerText = itinerary.activities.join(', ');
    document.getElementById('itineraryLocations').innerText = itinerary.locationsToVisit.join(', ');
    document.getElementById('itineraryTimeline').innerText = itinerary.timeline;
    document.getElementById('itineraryDuration').innerText = itinerary.duration;
    document.getElementById('itineraryLanguage').innerText = itinerary.language;
    document.getElementById('itineraryPrice').innerText = itinerary.price;
    document.getElementById('itineraryAvailableDates').innerText = itinerary.availableDates.join(', ');
    document.getElementById('itineraryAvailableTimes').innerText = itinerary.availableTimes.join(', ');
    document.getElementById('itineraryAccessibility').innerText = itinerary.accessibility ? 'Yes' : 'No';
    document.getElementById('itineraryPickUpLocation').innerText = itinerary.pickUpLocation;
    document.getElementById('itineraryDropOffLocation').innerText = itinerary.dropOffLocation;
}

// Event listener for "View Itinerary" button
document.getElementById('viewItineraryButton').addEventListener('click', () => {
    const itineraryId = document.getElementById('itineraryId').value.trim();

    if (itineraryId) {
        fetchItineraryById(itineraryId);
    } else {
        alert('Please enter a valid itinerary ID');
    }
});

// Fetch all itineraries when the page loads
fetchAllItineraries();
