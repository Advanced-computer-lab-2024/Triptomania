document.addEventListener('DOMContentLoaded', function () {
    const activityList = document.getElementById('activityList');
    const minBudget = document.getElementById('minBudget');
    const maxBudget = document.getElementById('maxBudget');
    const dateFilter = document.getElementById('dateFilter');
    const categorySelect = document.getElementById('categorySelect');
    const sortSelect = document.getElementById('sortSelect');
    const filterButton = document.getElementById('filterButton');
    const responseMessage = document.getElementById('responseMessage');
  
    // Fetch all activities on page load
    async function fetchActivities() {
        try {
            const response = await fetch('http://localhost:5000/api/tourist/activity/viewActivities'); // API endpoint to get activities
            const activities = await response.json();
            displayActivities(activities);
        } catch (error) {
            console.error('Error fetching activities:', error);
            responseMessage.textContent = "Error fetching activities. Please try again later.";
        }
    }
  
    // Display fetched activities
    function displayActivities(activities) {
        activityList.innerHTML = ''; // Clear existing activities
        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.classList.add('activity-item');
  
            activityElement.innerHTML = `
                <h2>${activity.name}</h2>
                <p>${activity.description}</p>
                <p>Price: $${activity.price}</p>
                <p>Category: ${activity.category}</p>
                <p>Ratings: ${activity.ratings}</p>
                <p>Date: ${new Date(activity.date).toLocaleDateString()}</p>
            `;
            activityList.appendChild(activityElement);
        });
  
        if (activities.length === 0) {
            responseMessage.textContent = "No activities found matching your criteria.";
        } else {
            responseMessage.textContent = "";
        }
    }
  
    // Filter activities based on user input
    filterButton.addEventListener('click', async function () {
        const min = parseFloat(minBudget.value) || 0;
        const max = parseFloat(maxBudget.value) || Infinity;
        const date = dateFilter.value;
        const category = categorySelect.value;

        let filterParams = `?budget=${max}`; // Sending max budget as a filter
        if (date) filterParams += `&date=${date}`;
        if (category) filterParams += `&category=${category}`;

        try {
            const response = await fetch(`http://localhost:5000/api/tourist/activity/filterActivities${filterParams}`);
            const filteredActivities = await response.json();
            displayActivities(filteredActivities);
        } catch (error) {
            console.error('Error filtering activities:', error);
            responseMessage.textContent = "Error filtering activities. Please try again later.";
        }
    });
  
    // Sort activities based on user selection
    sortSelect.addEventListener('change', async function () {
        const order = sortSelect.value; // high or low
        const sortBy = order.includes('ratings') ? 'ratings' : 'price'; // Determine sort option
        const sortOrder = order === 'high' ? 'high' : 'low'; // Determine order

        try {
            const response = await fetch(`http://localhost:5000/api/tourist/activity/sortActivities?order=${sortOrder}&sortBy=${sortBy}`);
            const sortedActivities = await response.json();
            displayActivities(sortedActivities);
        } catch (error) {
            console.error('Error sorting activities:', error);
            responseMessage.textContent = "Error sorting activities. Please try again later.";
        }
    });
  
    // Initial fetch of all activities
    fetchActivities();
});
