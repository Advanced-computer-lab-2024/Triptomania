let exchangeRates = { USD: 1 }; // Default exchange rate for USD
let lastFetchedItineraries = []; // Store itineraries data

// Fetch exchange rates for the selected currency
async function fetchExchangeRates(base = "USD") {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        exchangeRates = data.rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
    }
}

// Fetch itineraries from the server
async function fetchItineraries() {
    await fetchExchangeRates(); // Fetch exchange rates on page load
    try {
        const response = await fetch("http://localhost:5000/api/tourGuide/itinerary/viewItineraries");
        const data = await response.json();
        console.log(data);
        if (data.status) {
            lastFetchedItineraries = data.itineraries;
            displayItineraries(lastFetchedItineraries); // Default display in USD
        }
    } catch (error) {
        alert("Error loading itineraries: " + error.message);
    }
}

// Display itineraries with the selected currency conversion
function displayItineraries(itineraries, currency = "USD") {
    const itineraryList = document.getElementById("itineraryList");
    itineraryList.innerHTML = ''; // Clear previous itineraries

    itineraries.forEach(itinerary => {
        const convertedPrice = (itinerary.price * exchangeRates[currency]).toFixed(2);
        const itineraryDiv = document.createElement("div");
        itineraryDiv.classList.add("itinerary");

        itineraryDiv.innerHTML = `
            <h3>${itinerary.Name}</h3>
            <p>Duration: ${itinerary.duration}</p>
            <p>Price: ${convertedPrice} ${currency}</p>
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

// Handle currency selection change
document.getElementById("currencySelect").addEventListener("change", async function () {
    const selectedCurrency = this.value;
    await fetchExchangeRates("USD"); // Update exchange rates based on USD
    displayItineraries(lastFetchedItineraries, selectedCurrency); // Redisplay itineraries in new currency
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
                fetchItineraries(); // Refresh itineraries
            } else {
                alert(data.message);
            }
        });
    }
}

// Load itineraries when the page is loaded
window.onload = fetchItineraries;
