document.addEventListener('DOMContentLoaded', async function () {
    const complaintDetailsContainer = document.getElementById('complaintDetails');
    const replyButton = document.getElementById('replyButton');
    const replyText = document.getElementById('replyText');

    // Get complaint ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const complaintId = params.get('id');

    // Function to fetch and display complaint details
    async function fetchComplaintDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/complaints/viewComplaint/${complaintId}`);
            const complaint = await response.json();
            displayComplaintDetails(complaint.complaint);
        } catch (error) {
            console.error('Error fetching complaint details:', error);
        }
    }

    // Function to display complaint details
    function displayComplaintDetails(complaint) {
        complaintDetailsContainer.innerHTML = `
            <h2>${complaint.title}</h2>
            <p>Status: ${complaint.status}</p>
            <p>Date: ${new Date(complaint.date).toLocaleDateString()}</p>
            <p>${complaint.body}</p>
        `;
    }

    // Function to handle reply submission
    async function submitReply() {
        const replyContent = replyText.value.trim();
        if (!replyContent) {
            alert("Please enter a reply before submitting.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/admin/complaints/replyToComplaint/${complaintId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: replyContent })
            });

            if (response.ok) {
                alert("Reply submitted successfully!");
                replyText.value = ''; // Clear the textarea
            } else {
                throw new Error("Failed to submit reply");
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            alert("Error submitting reply. Please try again later.");
        }
    }

    // Add event listener for reply button
    replyButton.addEventListener('click', submitReply);

    // Initial fetch of complaint details
    fetchComplaintDetails();
});
