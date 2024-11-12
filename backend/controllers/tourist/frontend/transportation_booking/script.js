function displayDummyBookings() {
  const userId = document.getElementById('userId').value;
  if (!userId) {
    document.getElementById('responseMessage').textContent = 'Please enter your Tourist ID.';
    return;
  }

  const dummyBookings = [
    {
      origin: "New York",
      destination: "Washington D.C.",
      travelDate: "2023-12-10",
      travelTime: "10:00",
      travelType: "Bus",
    },
    {
      origin: "Los Angeles",
      destination: "San Francisco",
      travelDate: "2023-12-12",
      travelTime: "15:00",
      travelType: "Train",
    },
    {
      origin: "Chicago",
      destination: "New York",
      travelDate: "2023-12-15",
      travelTime: "09:00",
      travelType: "Car",
    }
  ];

  const bookingsContainer = document.getElementById('bookingsContainer');
  bookingsContainer.innerHTML = ''; // Clear previous data

  dummyBookings.forEach((booking, index) => {
    const bookingCard = document.createElement('div');
    bookingCard.classList.add('booking-card');

    bookingCard.innerHTML = `
      <p><strong>Origin:</strong> ${booking.origin}</p>
      <p><strong>Destination:</strong> ${booking.destination}</p>
      <p><strong>Travel Date:</strong> ${booking.travelDate}</p>
      <p><strong>Travel Time:</strong> ${booking.travelTime}</p>
      <p><strong>Travel Type:</strong> ${booking.travelType}</p>
      <button onclick="confirmBooking(${index})">Confirm This Booking</button>
    `;

    bookingsContainer.appendChild(bookingCard);
  });
}

async function confirmBooking(index) {
  const userId = document.getElementById('userId').value;
  if (!userId) {
    document.getElementById('responseMessage').textContent = 'Please enter your Tourist ID to confirm the booking.';
    return;
  }

  // Dummy booking data
  const dummyBookings = [
    { origin: "New York", destination: "Washington D.C.", travelDate: "2023-12-10", travelTime: "10:00", travelType: "Bus" },
    { origin: "Los Angeles", destination: "San Francisco", travelDate: "2023-12-12", travelTime: "15:00", travelType: "Train" },
    { origin: "Chicago", destination: "New York", travelDate: "2023-12-15", travelTime: "09:00", travelType: "Car" }
  ];

  const booking = dummyBookings[index];
  const requestBody = {
    origin: booking.origin,
    destination: booking.destination,
    travelDate: booking.travelDate,
    travelTime: booking.travelTime,
    travelType: booking.travelType
  };

  try {
    const response = await fetch(`http://localhost:5000/api/tourist/bookTransportation/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById('responseMessage').textContent = `Booking confirmed: ${result.message}`;
    } else {
      document.getElementById('responseMessage').textContent = `Error: ${result.error}`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('responseMessage').textContent = 'An error occurred while booking transportation.';
  }
}
