document.addEventListener("DOMContentLoaded", function () {
    
    const form = document.getElementById("addItineraryForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const newItinerary = {
            Name: document.getElementById("Name").value,
            activities: document.getElementById("activities").value.split(',').map(item => item.trim()),
            locationsToVisit: document.getElementById("locationsToVisit").value.split(',').map(item => item.trim()),
            timeLine: document.getElementById("timeLine").value,
            duration: document.getElementById("duration").value,
            language: document.getElementById("language").value,
            price: document.getElementById("price").value,
            availableDates: document.getElementById("availableDates").value.split(',').map(item => item.trim()),
            availableTimes: document.getElementById("availableTimes").value.split(',').map(item => item.trim()),
            accesibility: document.getElementById("accesibility").value.split(',').map(item => item.trim()),
            pickUp: document.getElementById("pickUp").value,
            dropOff: document.getElementById("dropOff").value,
            bookingMade: document.getElementById("bookingMade").value.split(',').map(item => item.trim()),
            Start_date: document.getElementById("Start_date").value,
            End_date: document.getElementById("End_date").value,
            Tags: document.getElementById("Tags").value.split(',').map(item => item.trim()),
            creatorId: document.getElementById("creatorId").value
        };

        fetch("http://localhost:5000/api/tourGuide/itinerary/addItinerary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItinerary)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert("Itinerary added successfully!");
                window.location.href = "itineraries.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error adding itinerary:", error);
            alert("There was an error adding the itinerary. Please try again.");
        });
    });
});
