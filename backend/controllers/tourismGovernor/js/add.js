document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addPlaceForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting the traditional way

        // Collect form data
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const picture = document.getElementById('picture').value;
        const location = document.getElementById('location').value;
        const openingHours = document.getElementById('openingHours').value;
        const closingHours = document.getElementById('closingHours').value;
        const ticketPrices = document.getElementById('ticketPrices').value;
        const category = document.getElementById('category').value;
        const tagsInput = document.getElementById('tags').value;
        const creatorId = document.getElementById('creatorId').value;

        // Convert the tags input into an array
        const tagsArray = tagsInput.split(',').map(tag => tag.trim());

        // Create the data object to send to the server
        const historicalPlaceData = {
            Name: name,
            Description: description,
            Picture: picture,
            Location: location,
            Opening_hours: openingHours,
            Closing_hours: closingHours,
            Ticket_prices: ticketPrices,
            Category: category,
            Tags: tagsArray,
            creatorId: creatorId
        };

        // Make the API request to add the historical place
        fetch('http://localhost:5000/api/tourismGoverner/addHistoricalPlace', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(historicalPlaceData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert('Historical place added successfully!');
                // Optionally clear the form
                form.reset();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding historical place:', error);
            alert('Error adding historical place: ' + error.message);
        });
    });
});
