let exchangeRates = { USD: 1 }; // Default exchange rate for USD
let lastFetchedActivities = []; // Store activities data

// Fetch exchange rates for the selected currency
async function fetchExchangeRates(base = "USD") {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        exchangeRates = data.rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
    }
}

// Fetch activities from the server
async function fetchActivities() {
    await fetchExchangeRates(); // Fetch exchange rates on page load
    try {
        const response = await fetch('http://localhost:5000/api/advertiser/activity/viewActivities');
        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }
        const activities = await response.json();
        lastFetchedActivities = activities;
        displayActivities(activities); // Default display in USD
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error loading activities: " + error.message;
    }
}

// Display activities with the selected currency conversion
function displayActivities(activities, currency = "USD") {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = ''; // Clear previous activities

    activities.forEach(activity => {
        const convertedPrice = (activity.price * exchangeRates[currency]).toFixed(2);
        const activityItem = document.createElement('div');
        activityItem.classList.add('activity-item');
        activityItem.innerHTML = `
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            <p>Date: ${activity.date}, Time: ${activity.time}</p>
            <p>Location: <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}" target="_blank">${activity.location}</a></p>
            <p>Price: ${convertedPrice} ${currency}</p>
            <p>Category: ${activity.category}</p>
            <p>Tags: ${activity.tags.join(', ')}</p>
            <p>Special Discounts: ${activity.specialDiscounts}</p>
            <p>Is Booking Open: ${activity.isBookingOpen ? 'Yes' : 'No'}</p>
            <button onclick="editActivity('${activity._id}')">Edit</button>
            <button onclick="deleteActivity('${activity._id}')">Delete</button>
        `;

        activityList.appendChild(activityItem);
    });
}

// Handle currency selection change
document.getElementById('currencySelect').addEventListener('change', async function () {
    const selectedCurrency = this.value;
    await fetchExchangeRates("USD"); // Update exchange rates based on USD
    displayActivities(lastFetchedActivities, selectedCurrency); // Redisplay activities in new currency
});

// Delete an activity
async function deleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/advertiser/activity/deleteActivity/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete activity');
        }

        fetchActivities(); // Refresh the activities list after deletion
        document.getElementById('responseMessage').textContent = "Activity deleted successfully.";
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error deleting activity: " + error.message;
    }
}

// Redirect to edit activity page
function editActivity(id) {
    window.location.href = `editActivity.html?id=${id}`; // Redirect to edit page
}

// Redirect to add activity page
document.getElementById('addActivityButton').addEventListener('click', function() {
    window.location.href = 'addActivity.html'; // Redirect to add activity page
});

// Filter activities
document.getElementById('filterButton').addEventListener('click', async function() {
    const budget = document.getElementById('budgetFilter').value;
    const date = document.getElementById('dateFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const ratings = document.getElementById('ratingsFilter').value;

    const filters = new URLSearchParams();

    if (budget) filters.append('budget', budget);
    if (date) filters.append('date', date);
    if (category) filters.append('category', category);
    if (ratings) filters.append('ratings', ratings);

    try {
        const response = await fetch(`http://localhost:5000/api/tourist/activity/filterActivities?${filters}`);
        if (!response.ok) throw new Error("Failed to filter activities");
        
        const activities = await response.json();
        displayActivities(activities); // Show filtered activities
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error filtering activities: " + error.message;
    }
});

// Sort activities
document.getElementById('sortButton').addEventListener('click', async function() {
    const sortBy = document.getElementById('sortBySelect').value;
    const order = document.getElementById('sortOrderSelect').value;

    const params = new URLSearchParams({ sortBy, order });

    try {
        const response = await fetch(`http://localhost:5000/api/tourist/activity/sortActivities?${params}`);
        if (!response.ok) throw new Error("Failed to sort activities");

        const activities = await response.json();
        displayActivities(activities); // Show sorted activities
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error sorting activities: " + error.message;
    }
});

// Load activities when the page is loaded
window.onload = fetchActivities;
