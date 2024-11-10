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
    productId,
    rating: 5, // You can adjust this or add a rating input
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

    if (response.status === 405) {
      // Specific handling for 405 error
      document.getElementById("responseMessage").textContent = "Method Not Allowed: Check the server route and method.";
      document.getElementById("responseMessage").style.color = "red";
      return;
    }

    if (!response.ok) {
      // General error handling for other HTTP errors
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    document.getElementById("responseMessage").textContent = "Review submitted successfully!";
    document.getElementById("responseMessage").style.color = "green";

  } catch (error) {
    // Network or other unexpected error handling
    document.getElementById("responseMessage").textContent = "Error submitting review. Please try again.";
    document.getElementById("responseMessage").style.color = "red";
    console.error("Error submitting review:", error);
  }
});
