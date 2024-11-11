document.getElementById("changePasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Capture form data
    const type = document.getElementById("type").value;
    const id = document.getElementById("id").value.trim();
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageDiv = document.getElementById("message");

    messageDiv.innerHTML = ""; // Clear previous messages

    try {
        // Send a POST request to change the password
        const response = await fetch(`http://localhost:5000/api/${type}/changePassword/${id}/${type}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
        });

        // Handle the response
        const result = await response.json();
        if (response.ok) {
            messageDiv.style.color = "green";
            messageDiv.innerHTML = "Password changed successfully!";
        } else {
            messageDiv.style.color = "red";
            messageDiv.innerHTML = result.message || "Error changing password";
        }
    } catch (error) {
        console.error("Error:", error);
        messageDiv.style.color = "red";
        messageDiv.innerHTML = "An unexpected error occurred";
    }
});
