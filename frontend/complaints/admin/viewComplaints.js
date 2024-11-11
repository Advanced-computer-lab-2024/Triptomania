document.addEventListener('DOMContentLoaded', function () {
    const complaintsList = document.getElementById('complaintsList');
    const statusSelect = document.getElementById('statusSelect');
    const sortDate = document.getElementById('sortDate');
    const filterButton = document.getElementById('filterButton');

    async function fetchComplaints() {
        try {
            const response = await fetch('http://localhost:5000/api/admin/complaints/viewComplaints');
            const complaints = await response.json();
            displayComplaints(complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    }

    function displayComplaints(complaints) {
        complaintsList.innerHTML = '';
        complaints.forEach(complaint => {
            const complaintItem = document.createElement('div');
            complaintItem.classList.add('complaint-item');
            const complaintDate = complaint.date ? new Date(complaint.date).toLocaleDateString() : "N/A";

            complaintItem.innerHTML = `
                <h2>${complaint.title}</h2>
                <p>Status: <span class="complaint-status">${complaint.status}</span></p>
                <p>Date: ${complaintDate}</p>
            `;

            
            const editButton = document.createElement('button');
            editButton.classList.add('editStatusButton');
            editButton.textContent = "Edit Status";

             // Create Reply button
            const replyButton = document.createElement('button');
            replyButton.classList.add('replyButton');
            replyButton.textContent = "Reply";
            replyButton.addEventListener('click', () => {
                window.location.href = `complaintDetails.html?id=${complaint._id}`;
            });
            
            const statusDropdown = document.createElement('select');
            statusDropdown.classList.add('status-dropdown');
            statusDropdown.style.display = 'none';

            const pendingOption = document.createElement('option');
            pendingOption.value = 'pending';
            pendingOption.textContent = 'Pending';

            const resolvedOption = document.createElement('option');
            resolvedOption.value = 'resolved';
            resolvedOption.textContent = 'Resolved';

            statusDropdown.append(pendingOption, resolvedOption);


            
            
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = 'Status updated successfully!';
            successMessage.style.display = 'none';

            
            editButton.addEventListener('click', () => {
                statusDropdown.style.display = statusDropdown.style.display === 'none' ? 'block' : 'none';
            });

            
            statusDropdown.addEventListener('change', async () => {
                const newStatus = statusDropdown.value;
                await updateStatus(complaint._id, newStatus);
                statusDropdown.style.display = 'none'; 
                successMessage.style.display = 'block'; 
                complaintItem.querySelector('.complaint-status').textContent = newStatus; 

                setTimeout(() => {
                    successMessage.style.display = 'none'; 
                }, 2000);
            });

            complaintItem.append(editButton, replyButton,statusDropdown, successMessage);
            complaintsList.appendChild(complaintItem);
        });
    }

    async function updateStatus(complaintId, newStatus) {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/complaints/updateStatus/${complaintId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error("Failed to update status");
        } catch (error) {
            console.error('Error updating status:', error);
            alert("Error updating status. Please try again later.");
        }
    }

    async function applyFilters() {
        let url;

        if (statusSelect.value) {
            url = `http://localhost:5000/api/admin/complaints/filterComplaints?status=${statusSelect.value}`;
        } else if (sortDate.value) {
            url = `http://localhost:5000/api/admin/complaints/sortComplaints?sort=${sortDate.value}`;
        } else {
            fetchComplaints();
            return;
        }

        try {
            const response = await fetch(url);
            const complaints = await response.json();
            displayComplaints(complaints);
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    filterButton.addEventListener('click', applyFilters);
    fetchComplaints();
});