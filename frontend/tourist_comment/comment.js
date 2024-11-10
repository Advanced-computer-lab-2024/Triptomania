document.getElementById("submitCommentBtn").addEventListener("click", async () => {
    const type = document.getElementById("type").value;
    const touristId = document.getElementById("touristId").value;
    const comment = document.getElementById("comment").value;
    const typeId = document.getElementById("typeId").value;
    const responseMessage = document.getElementById("responseMessage");
  
    // Basic validation
    if (!type || !touristId || !comment || !typeId) {
      responseMessage.textContent = "All fields are required!";
      responseMessage.style.color = "red";
      return;
    }
  
    try {
      const response = await fetch(`/api/tourist/comment/${typeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, touristId, comment }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        responseMessage.textContent = "Comment submitted successfully!";
        responseMessage.style.color = "green";
      } else {
        responseMessage.textContent = result.message || "Failed to submit comment.";
        responseMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      responseMessage.textContent = "An error occurred. Please try again later.";
      responseMessage.style.color = "red";
    }
  });
  