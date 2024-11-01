document.addEventListener("DOMContentLoaded", async () => {
    const placesContainer = document.getElementById("placesContainer");
    const addPlaceBtn = document.getElementById("addPlaceBtn");

    // Redirect to add page
    addPlaceBtn.addEventListener('click', () => {
        window.location.href = "add.html";
    });

    // Fetch all historical places
    const response = await fetch('http://localhost:5000/api/tourismGovernor/getHistoricalPlaces');
    const result = await response.json();

    if (result.status) {
        result.historicalPlaces.forEach(place => {
            const placeDiv = document.createElement("div");
            placeDiv.classList.add("place");

            placeDiv.innerHTML = `
                <h2>${place.Name}</h2>
                <p>${place.Description}</p>
                <p><strong>Location:</strong> ${place.Location}</p>
                <p><strong>Opening Hours:</strong> ${place.Opening_hours}</p>
                <p><strong>Closing Hours:</strong> ${place.Closing_hours}</p>
                <button class="editBtn" data-id="${place._id}">Edit</button>
                <button class="deleteBtn" data-id="${place._id}">Delete</button>
            `;

            placesContainer.appendChild(placeDiv);

            // Handle delete
            placeDiv.querySelector(".deleteBtn").addEventListener("click", async (e) => {
                const id = e.target.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this place?")) {
                    await fetch(`http://localhost:5000/api/tourismGovernor/deleteHistoricalPlace/${id}`, {
                        method: "DELETE"
                    });
                    window.location.reload();
                }
            });

            // Handle edit
            placeDiv.querySelector(".editBtn").addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                window.location.href = `edit.html?id=${id}`;
            });
        });
    }
});
