document.getElementById('itineraryForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting the default way

    // Gather the itinerary data
    const itineraryData = {
        Name: document.getElementById('name').value,
        activities: document.getElementById('activities').value.split(',').map(activity => activity.trim()),
        locationsToVisit: document.getElementById('locationsToVisit').value.split(',').map(location => location.trim()),
        timeLine: document.getElementById('timeLine').value,
        duration: document.getElementById('duration').value,
        language: document.getElementById('language').value,
        price: parseFloat(document.getElementById('price').value),
        availableDates: document.getElementById('availableDates').value.split(',').map(date => date.trim()),
        availableTimes: document.getElementById('availableTimes').value.split(',').map(time => time.trim()),
        accesibility: document.getElementById('accessibility').value.split(',').map(access => access.trim()),
        pickUp: document.getElementById('pickUp').value,
        dropOff: document.getElementById('dropOff').value,
        bookingMade: document.getElementById('bookingMade').value.split(',').map(id => id.trim()),
        Start_date: document.getElementById('start_date').value,
        End_date: document.getElementById('end_date').value,
        Tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
        creatorId: "your_creator_id_here", // Replace with actual creator ID if available
    };

    console.log('Submitting itinerary:', itineraryData); // Log the data being submitted

    try {
        const response = await fetch('http://localhost:5000/api/tourGuide/itinerary/addItinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itineraryData),
        });

        console.log('Response status:', response.status); // Log the response status

        if (!response.ok) {
            const errorText = await response.text(); // Get the error text
            throw new Error('Network response was not ok: ' + errorText);
        }

        const result = await response.json();
        console.log('Itinerary added:', result);
        alert('Itinerary added successfully!');
        // Reset the form only after a successful submission
        document.getElementById('itineraryForm').reset();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        
        // Display error message without clearing the form
        const errorMessage = document.createElement('div');
        errorMessage.style.color = 'red';
        errorMessage.style.marginTop = '10px';
        errorMessage.textContent = 'Error adding itinerary: ' + error.message;

        // Remove any existing error messages
        const existingError = document.getElementById('error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add the error message to the form
        errorMessage.id = 'error-message';
        document.getElementById('itineraryForm').appendChild(errorMessage);
    }
});
