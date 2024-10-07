document.addEventListener('DOMContentLoaded', fetchActivities);

async function fetchActivities() {
    try {
        const response = await fetch('http://localhost:5000/api/advertiser/activity/viewActivities');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const activities = await response.json();
        displayActivities(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        document.getElementById('activitiesList').innerHTML = '<p>Error loading activities.</p>';
    }
}

function displayActivities(activities) {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';

    if (activities.length === 0) {
        activitiesList.innerHTML = '<p>No activities found.</p>';
        return;
    }

    activities.forEach(activity => {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'activity';
        activityDiv.innerHTML = `
            <h3>${activity.name}</h3>
            <p><strong>Description:</strong> ${activity.description}</p>
            <p><strong>Date:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${activity.time}</p>
            <p><strong>Location:</strong> ${activity.location}</p>
            <p><strong>Price:</strong> $${(activity.price || 0).toFixed(2)}</p>
            <p><strong>Category:</strong> ${activity.category}</p>
            <p><strong>Tags:</strong> ${Array.isArray(activity.tags) ? activity.tags.join(', ') : activity.tags || 'None'}</p>
            <p><strong>Special Discounts:</strong> ${activity.specialDiscounts}%</p>
            <p><strong>Booking Open:</strong> ${activity.isBookingOpen ? 'Yes' : 'No'}</p>
            <button class="deleteActivityButton" data-id="${activity._id}">Delete</button>
            <button class="editActivityButton" data-id="${activity._id}">Edit</button>
        `;
        activitiesList.appendChild(activityDiv);
    });
}

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('deleteActivityButton')) {
        const activityId = event.target.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this activity?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/advertiser/activity/deleteActivity/${activityId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete activity');
                }

                const result = await response.json();
                alert(result.message);
                fetchActivities(); // Refresh the activities list
            } catch (error) {
                console.error('Error deleting activity:', error);
                alert('Error deleting activity: ' + error.message);
            }
        }
    }
    if (event.target.classList.contains('editActivityButton')) {
        const activityId = event.target.getAttribute('data-id');
        await loadActivityData(activityId);
        document.getElementById('editActivityModal').style.display = 'block';
    }
});

async function loadActivityData(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/advertiser/activity/editActivity/${id}`);
        if (!response.ok) {
            throw new Error(`Activity not found: ${response.statusText}`);
        }
        const activity = await response.json();

        document.getElementById('editActivityName').value = activity.name;
        document.getElementById('editActivityDescription').value = activity.description;
        document.getElementById('editActivityDate').value = activity.date.split('T')[0]; 
        document.getElementById('editActivityTime').value = activity.time;
        document.getElementById('editActivityLocation').value = activity.location;
        document.getElementById('editActivityPrice').value = activity.price;
        document.getElementById('editActivityCategory').value = activity.category;
        document.getElementById('editActivityTags').value = activity.tags.join(', ');
        document.getElementById('editActivitySpecialDiscounts').value = activity.specialDiscounts;
        document.getElementById('editActivityIsBookingOpen').checked = activity.isBookingOpen;

        // Store the activity ID for later use
        document.getElementById('editActivityModal').setAttribute('data-id', activity._id);
    } catch (error) {
        console.error('Error loading activity data:', error);
        alert('Error loading activity data: ' + error.message);
    }
}

// Handle submission of the edited activity
document.getElementById('submitEditActivityButton').addEventListener('click', async () => {
    const activityId = document.getElementById('editActivityModal').getAttribute('data-id');

    const updatedActivity = {
        name: document.getElementById('editActivityName').value,
        description: document.getElementById('editActivityDescription').value,
        date: document.getElementById('editActivityDate').value,
        time: document.getElementById('editActivityTime').value,
        location: document.getElementById('editActivityLocation').value,
        price: parseFloat(document.getElementById('editActivityPrice').value),
        category: document.getElementById('editActivityCategory').value,
        tags: document.getElementById('editActivityTags').value.split(',').map(tag => tag.trim()),
        specialDiscounts: parseFloat(document.getElementById('editActivitySpecialDiscounts').value),
        isBookingOpen: document.getElementById('editActivityIsBookingOpen').checked,
    };

    try {
        const response = await fetch(`http://localhost:5000/api/advertiser/activity/editActivity/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedActivity),
        });

        if (!response.ok) {
            throw new Error('Failed to update activity');
        }

        const result = await response.json();
        alert(result.message);
        document.getElementById('editActivityModal').style.display = 'none'; // Close the modal
        fetchActivities(); // Refresh the activities list
    } catch (error) {
        console.error('Error updating activity:', error);
        alert('Error updating activity: ' + error.message);
    }
});

// Close the edit modal
document.getElementById('closeEditModalButton').addEventListener('click', () => {
    document.getElementById('editActivityModal').style.display = 'none';
});
