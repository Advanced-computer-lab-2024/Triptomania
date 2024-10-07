// activities.js
document.getElementById('filterButton').addEventListener('click', fetchAndFilterActivities);

async function fetchAndFilterActivities() {
    const date = document.getElementById('filterDate').value;
    const budget = document.getElementById('filterBudget').value;
    const category = document.getElementById('filterCategory').value;
    const rating = document.getElementById('filterRating').value;

    try {
        const response = await fetch('http://localhost:5000/api/advertiser/activity/viewActivities');
        const activities = await response.json();

        const filteredActivities = activities.filter(activity => {
            return (!date || activity.date === date) &&
                   (!budget || activity.price <= budget) &&
                   (!category || activity.category.toLowerCase().includes(category.toLowerCase())) &&
                   (!rating || activity.rating >= rating);
        });

        displayActivities(filteredActivities);
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

function displayActivities(activities) {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';

    if (activities.length === 0) {
        activitiesList.innerHTML = '<p>No activities found matching the filters.</p>';
        return;
    }

    activities.forEach(activity => {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'activity';
        activityDiv.innerHTML = `
            <h3>${activity.name}</h3>
            <p><strong>Date:</strong> ${activity.date}</p>
            <p><strong>Location:</strong> ${activity.location}</p>
            <p><strong>Price:</strong> $${activity.price}</p>
            <p><strong>Category:</strong> ${activity.category}</p>
            <p><strong>Rating:</strong> ${activity.rating}/5</p>
        `;
        activitiesList.appendChild(activityDiv);
    });
}
