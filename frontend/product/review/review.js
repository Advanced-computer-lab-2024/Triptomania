document.getElementById("submitReviewBtn").addEventListener("click", async function () {
  const productId = document.getElementById("productId").value;
  const touristId = document.getElementById("touristId").value;
  const review = document.getElementById("review").value;

  // Validate input fields
  if (!productId || !touristId || !review) {
    document.getElementById("responseMessage").textContent = "All fields are required!";
    document.getElementById("responseMessage").style.color = "red";
    return;
  }

  const requestData = {
    touristId,
    review
  };

  try {
    const response = await fetch(`http://localhost:5000/api/tourist/product/reviews/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    if (response.ok) {
      // Success case
      document.getElementById("responseMessage").textContent = "Review submitted successfully!";
      document.getElementById("responseMessage").style.color = "green";
      return;
    }

    // Handle specific backend error messages
    if (response.status === 404) {
      document.getElementById("responseMessage").textContent = responseData.error || "Product not found.";
      document.getElementById("responseMessage").style.color = "red";
    } else if (response.status === 403) {
      document.getElementById("responseMessage").textContent = responseData.error || "You must purchase the product to review it.";
      document.getElementById("responseMessage").style.color = "red";
    } else if (response.status === 400) {
      document.getElementById("responseMessage").textContent = responseData.error || "Bad request. Please check your input.";
      document.getElementById("responseMessage").style.color = "red";
    } else if (response.status === 500) {
      document.getElementById("responseMessage").textContent = responseData.error || "Server error. Please try again later.";
      document.getElementById("responseMessage").style.color = "red";
    } else {
      // General error handler for other unknown errors
      document.getElementById("responseMessage").textContent = responseData.error || "An unknown error occurred.";
      document.getElementById("responseMessage").style.color = "red";
    }

  } catch (error) {
    // Network or other unexpected error handling
    document.getElementById("responseMessage").textContent = "Error submitting review. Please try again.";
    document.getElementById("responseMessage").style.color = "red";
    console.error("Error submitting review:", error);
  }
});
