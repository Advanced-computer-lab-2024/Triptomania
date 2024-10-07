// Function to fetch all activities from the server
async function fetchActivities() {
    try {
        const response = await fetch('http://localhost:5000/api/advertiser/activity/viewActivities');
        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }
        const activities = await response.json();
        displayActivities(activities);
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error loading activities: " + error.message;
    }
}

// Function to display activities on the page
function displayActivities(activities) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = ''; // Clear previous activities

    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.classList.add('activity-item');
        activityItem.innerHTML = `
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            <p>Date: ${activity.date}, Time: ${activity.time}</p>
            <p>Location: <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}" target="_blank">${activity.location}</a></p>
            <p>Price: $${activity.price}</p>
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

// Function to delete an activity
async function deleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/advertiser/activity/deleteActivity/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete activity');
        }

        // Refresh the activities list after deletion
        fetchActivities();
        document.getElementById('responseMessage').textContent = "Activity deleted successfully.";
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error deleting activity: " + error.message;
    }
}

// Function to redirect to the edit activity page
function editActivity(id) {
    window.location.href = `editActivity.html?id=${id}`; // Redirect to edit page
}

// Function to redirect to the add activity page
document.getElementById('addActivityButton').addEventListener('click', function() {
    window.location.href = 'addActivity.html'; // Redirect to add activity page
});

// Load activities when the page is loaded
window.onload = fetchActivities;
