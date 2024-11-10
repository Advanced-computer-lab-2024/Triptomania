document.getElementById("submitReviewBtn").addEventListener("click", async function () {
    const productId = document.getElementById("productId").value;
    const touristId = document.getElementById("touristId").value;
    const review = document.getElementById("review").value;
  
    // Validate input fields
    if (!productId || !touristId || !review) {
      document.getElementById("responseMessage").textContent = "All fields are required!";
      return;
    }
  
    // Prepare the data to send to the API
    const requestData = {
      productId,
      rating: 5, // You can modify the rating logic as needed
      touristId,
      review
    };
  
    try {
      // Send the POST request to the server
      const response = await fetch(`/api/tourist/product/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Success message
        document.getElementById("responseMessage").textContent = "Review submitted successfully!";
        document.getElementById("responseMessage").style.color = "green";
      } else {
        // Error message
        document.getElementById("responseMessage").textContent = data.message || "Something went wrong.";
        document.getElementById("responseMessage").style.color = "red";
      }
    } catch (error) {
      document.getElementById("responseMessage").textContent = "Error submitting review. Please try again.";
      document.getElementById("responseMessage").style.color = "red";
      console.error("Error submitting review:", error);
    }
  });
  