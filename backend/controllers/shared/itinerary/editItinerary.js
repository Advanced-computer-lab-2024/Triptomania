document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // Fetch the itinerary details to pre-fill the form
    fetch(`http://localhost:5000/api/tourGuide/itinerary/getItinerary/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const itinerary = data.data;

                // Pre-fill the form fields
                document.getElementById("name").value = itinerary.Name;
                document.getElementById("activities").value = itinerary.activities;
                document.getElementById("locationsToVisit").value = itinerary.locationsToVisit;
                document.getElementById("timeLine").value = itinerary.timeLine;
                document.getElementById("duration").value = itinerary.duration;
                document.getElementById("language").value = itinerary.language;
                document.getElementById("price").value = itinerary.price;
                document.getElementById("availableDates").value = itinerary.availableDates;
                document.getElementById("availableTimes").value = itinerary.availableTimes;
                document.getElementById("accesibility").value = itinerary.accesibility;
                document.getElementById("pickUp").value = itinerary.pickUp;
                document.getElementById("dropOff").value = itinerary.dropOff;
                document.getElementById("bookingMade").value = itinerary.bookingMade;
                document.getElementById("Start_date").value = itinerary.Start_date ? itinerary.Start_date.split('T')[0] : '';
                document.getElementById("End_date").value = itinerary.End_date ? itinerary.End_date.split('T')[0] : '';
                document.getElementById("Tags").value = itinerary.Tags;
                document.getElementById("creatorId").value = itinerary.creatorId;
            }
        })
        .catch(error => {
            console.error('Error fetching itinerary:', error);
            alert("Error fetching itinerary details. Please try again.");
        });

    // Handle form submission to update the itinerary
    document.getElementById("editItineraryForm").addEventListener("submit", function(event) {
        event.preventDefault();

        // Collect updated itinerary data from the form
        const updatedItinerary = {
            Name: document.getElementById("name").value,
            activities: document.getElementById("activities").value,
            locationsToVisit: document.getElementById("locationsToVisit").value,
            timeLine: document.getElementById("timeLine").value,
            duration: document.getElementById("duration").value,
            language: document.getElementById("language").value,
            price: document.getElementById("price").value,
            availableDates: document.getElementById("availableDates").value,
            availableTimes: document.getElementById("availableTimes").value,
            accesibility: document.getElementById("accesibility").value,
            pickUp: document.getElementById("pickUp").value,
            dropOff: document.getElementById("dropOff").value,
            bookingMade: document.getElementById("bookingMade").value,
            Start_date: document.getElementById("Start_date").value,
            End_date: document.getElementById("End_date").value,
            Tags: document.getElementById("Tags").value,
            creatorId: document.getElementById("creatorId").value
        };

        // Send updated itinerary data to the server
        fetch(`http://localhost:5000/api/tourGuide/itinerary/editItinerary/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedItinerary)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert("Itinerary updated successfully!");
                window.location.href = "itineraries.html";
            } else {
                alert(data.error || "An error occurred while updating the itinerary.");
            }
        })
        .catch(error => {
            console.error('Error updating itinerary:', error);
            alert("Error updating itinerary. Please try again.");
        });
    });
});
