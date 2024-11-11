async function bookTransportation() {
    const userId = document.getElementById('userId').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const travelDate = document.getElementById('travelDate').value;
    const travelTime = document.getElementById('travelTime').value;
    const travelType = document.getElementById('travelType').value;
  
    if (!userId || !origin || !destination || !travelDate || !travelTime || !travelType) {
      document.getElementById('responseMessage').textContent = 'Please fill in all fields.';
      return;
    }
  
    const requestBody = {
      origin: origin,
      destination: destination,
      travelDate: travelDate,
      travelTime: travelTime,
      travelType: travelType
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
        document.getElementById('responseMessage').textContent = result.message;
      } else {
        document.getElementById('responseMessage').textContent = `Error: ${result.error}`;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('responseMessage').textContent = 'An error occurred while booking transportation.';
    }
  }
  