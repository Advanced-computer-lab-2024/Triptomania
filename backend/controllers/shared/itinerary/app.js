document.addEventListener("DOMContentLoaded", function() {
    const itineraryList = document.getElementById("itineraryList");
    const addItineraryButton = document.getElementById("addItineraryButton");

    // Fetch all itineraries from API
    fetch("http://localhost:5000/api/tourGuide/itinerary/getItineraries")
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const itineraries = data.itinerary;
                itineraries.forEach(itinerary => {
                    const itineraryDiv = document.createElement("div");
                    itineraryDiv.classList.add("itinerary");

                    itineraryDiv.innerHTML = `
                        <h3>${itinerary.Name}</h3>
                        <p>Duration: ${itinerary.duration}</p>
                        <p>Price: ${itinerary.price}</p>
                        <button class="edit" data-id="${itinerary._id}">Edit</button>
                        <button class="delete" data-id="${itinerary._id}">Delete</button>
                    `;

                    itineraryList.appendChild(itineraryDiv);
                });

                // Add event listeners for edit and delete buttons
                document.querySelectorAll(".edit").forEach(button => {
                    button.addEventListener("click", function() {
                        const id = this.getAttribute("data-id");
                        window.location.href = `editItinerary.html?id=${id}`;
                    });
                });

                document.querySelectorAll(".delete").forEach(button => {
                    button.addEventListener("click", function() {
                        const id = this.getAttribute("data-id");
                        deleteItinerary(id);
                    });
                });
            }
        });

    // Redirect to Add Itinerary page
    addItineraryButton.addEventListener("click", function() {
        window.location.href = "addItinerary.html";
    });
});

// Delete itinerary by ID
function deleteItinerary(id) {
    if (confirm("Are you sure you want to delete this itinerary?")) {
        fetch(`http://localhost:5000/api/tourGuide/itinerary/deleteItinerary/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert("Itinerary deleted successfully!");
                window.location.reload();
            } else {
                alert(data.message);
            }
        });
    }
}
