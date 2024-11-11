document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get('hotelId');

  try {
    const response = await fetch(`http://localhost:5000/api/tourist/getHotelOffers?hotelId=${hotelId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();

    if (!data.offers || data.offers.length === 0) {
      throw new Error("No offers available for this hotel.");
    }

    displayOffers(data.offers[0].offers);

  } catch (error) {
    // Check if the error code matches the "No Rooms Available" error
    if (error.description && error.description[0].code === 3664) {
      document.getElementById('offersList').innerHTML = `<p>No rooms available at the requested property.</p>`;
    } else {
      console.error("Error fetching hotel offers:", error);
      document.getElementById('offersList').innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
});

function displayOffers(offers) {
  const offersList = document.getElementById('offersList');
  offersList.innerHTML = offers.length ?
    offers.map(offer => `
      <div class="offer">
        <p>Price: ${offer.price.total} ${offer.price.currency}</p>
        <button onclick="bookHotel('${offer.id}')">Book Offer</button>
      </div>
    `).join('') : `<p>No offers available</p>`;
}

function bookHotel(offerId) {
  window.location.href = `bookHotel.html?offerId=${offerId}`;
}
