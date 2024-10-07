document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("getMyItinerariesForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const creatorId = document.getElementById("creatorId").value;

        fetch(`http://localhost:5000/api/tourGuide/itinerary/getMyItineraries/${creatorId}`)
            .then(response => response.json())
            .then(data => {
                const itineraryList = document.getElementById("itineraryList");
                itineraryList.innerHTML = ""; // Clear any previous results

                if (data.status) {
                    const itineraries = data.itineraries;
                    if (itineraries.length > 0) {
                        itineraries.forEach(itinerary => {
                            const itineraryItem = document.createElement("div");
                            itineraryItem.className = "itinerary-item";
                            itineraryItem.innerHTML = `
                                <h3>${itinerary.Name}</h3>
                                <p><strong>Duration:</strong> ${itinerary.duration}</p>
                                <p><strong>Price:</strong> ${itinerary.price}</p>
                                <p><strong>Locations:</strong> ${itinerary.locationsToVisit}</p>
                                <p><strong>Activities:</strong> ${itinerary.activities}</p>
                                <p><strong>Available Dates:</strong> ${itinerary.availableDates}</p>
                                <p><strong>Available Times:</strong> ${itinerary.availableTimes}</p>
                                <!-- Add more fields as needed -->
                            `;
                            itineraryList.appendChild(itineraryItem);
                        });
                    } else {
                        itineraryList.innerHTML = "<p>No itineraries found for this creator ID.</p>";
                    }
                } else {
                    itineraryList.innerHTML = `<p>${data.error}</p>`;
                }
            })
            .catch(err => {
                document.getElementById("itineraryList").innerHTML = `<p>Error fetching itineraries: ${err.message}</p>`;
            });
    });
});
