document.getElementById('bookingForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const urlParams = new URLSearchParams(window.location.search);
    const offerId = urlParams.get('offerId');
  
    const bookingData = {
      offerId: offerId,
      payment: {
        method: document.getElementById('paymentMethod').value,
        vendorCode: document.getElementById('vendorCode').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        holderName: document.getElementById('holderName').value,
      }
    };
  
    const touristId = document.getElementById('touristId').value;
  
    try {
      const response = await fetch(`http://localhost:5000/api/tourist/bookHotel/${touristId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();
      alert(data.message || 'Booking successful!');
    } catch (error) {
      console.error("Error booking hotel:", error);
      alert('Booking failed. Please try again.');
    }
  });
  