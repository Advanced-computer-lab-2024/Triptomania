document.getElementById('cityForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
  
    try {
      const response = await fetch(`http://localhost:5000/api/tourist/getHotels?city=${city}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      displayHotels(data.hotels.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      document.getElementById('hotelsList').innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
  
  function displayHotels(hotels) {
    const hotelsList = document.getElementById('hotelsList');
    hotelsList.innerHTML = hotels.map(hotel => `
      <div class="hotel">
        <p>${hotel.name}</p>
        <button onclick="getHotelOffers('${hotel.hotelId}')">View Offers</button>
      </div>
    `).join('');
  }
  
  function getHotelOffers(hotelId) {
    window.location.href = `getHotelOffers.html?hotelId=${hotelId}`;
  }
  