document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    // Fetch historical place by ID
    const response = await fetch(`http://localhost:5000/api/tourismGoverner/getHistoricalPlace/${id}`);
    const result = await response.json();

    if (result.status) {
        const place = result.data;
        document.getElementById("placeId").value = place._id;
        document.getElementById("name").value = place.Name;
        document.getElementById("description").value = place.Description;
        document.getElementById("picture").value = place.Picture;
        document.getElementById("location").value = place.Location;
        document.getElementById("openingHours").value = place.Opening_hours;
        document.getElementById("closingHours").value = place.Closing_hours;
        document.getElementById("ticketPrices").value = place.Ticket_prices;
        document.getElementById("category").value = place.Category;
    }

    // Handle form submission
    document.getElementById("editPlaceForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const placeId = document.getElementById("placeId").value;

        const response = await fetch(`http://localhost:5000/api/tourismGoverner/editHistoricalPlace/${placeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.status) {
            window.location.href = "index.html";
        } else {
            alert(result.error);
        }
    });
});
