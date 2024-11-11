// Attach event listeners to buttons/forms
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded"); // Debugging log

    const getPendingUsersBtn = document.getElementById('getPendingUsersBtn');
    const acceptUserForm = document.getElementById('acceptUserForm');
    const rejectUserForm = document.getElementById('rejectUserForm');
    const acceptTermsForm = document.getElementById('acceptTermsForm');

    if (getPendingUsersBtn) {
        getPendingUsersBtn.addEventListener('click', getPendingUsers);
        console.log("Event listener attached to 'getPendingUsersBtn' button.");
    } else {
        console.error("'getPendingUsersBtn' button not found.");
    }

    if (acceptUserForm) {
        acceptUserForm.addEventListener('submit', acceptUser);
    }

    if (rejectUserForm) {
        rejectUserForm.addEventListener('submit', rejectUser);
    }

    if (acceptTermsForm) {
        acceptTermsForm.addEventListener('submit', acceptTerms);
    }
});

// Define the base API URL
const API_URL = 'http://localhost:5000/api/admin';

// Fetch the pending users from the API
const getPendingUsers = async () => {
    console.log('Get Pending Users button clicked'); // Log when the button is clicked
    try {
        const response = await fetch(`${API_URL}/pending-users`);
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data

        if (data.pendingUsers) {
            displayPendingUsers(data.pendingUsers);
        } else {
            console.error("Error: No pending users found.");
            showResponse("No pending users found.");
        }
    } catch (error) {
        console.error("Error fetching pending users:", error);
        showResponse('Error fetching pending users: ' + error.message);
    }
};

const displayPendingUsers = (pendingUsers) => {
    const sellersContainer = document.getElementById('pendingUsersList');
    sellersContainer.innerHTML = ''; // Clear the previous content

    // Iterate through each category of users: sellers, advertisers, and tour guides
    ['sellers', 'advertisers', 'tourGuides'].forEach(category => {
        const categoryUsers = pendingUsers[category];

        if (categoryUsers && categoryUsers.length > 0) {
            const categorySection = document.createElement('div');
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySection.appendChild(categoryTitle);

            categoryUsers.forEach(user => {
                const userCard = document.createElement('div');
                userCard.classList.add('user-card');

                // Display user details (including ID, acceptTerms status)
                const userInfo = `
                    <strong>ID:</strong> ${user._id} <br>
                    <strong>Username:</strong> ${user.username} <br>
                    <strong>Email:</strong> ${user.email} <br>
                    <strong>Status:</strong> ${user.status} <br>
                    <strong>Accept Terms:</strong> ${user.acceptedTerms ? 'Yes' : 'No'} <br>
                `;
                userCard.innerHTML = userInfo;
                categorySection.appendChild(userCard);
            });

            sellersContainer.appendChild(categorySection);
        }
    });
};

async function acceptUser(event) {
    event.preventDefault();

    const id = document.getElementById('acceptUserId').value;
    const type = document.getElementById('acceptUserType').value;

    try {
        // Step 1: Send the PUT request to accept the user
        const response = await fetch(`http://localhost:5000/api/admin/acceptUser/${id}/${type}`, {
            method: 'PUT',
        });

        // Step 2: Check for successful response
        if (!response.ok) {
            // If the response isn't successful (status 2xx), throw an error
            throw new Error('Failed to accept user');
        }

        // Step 3: Parse the JSON response
        const data = await response.json();
        console.log(data);  // Log the response for debugging

        if (data.message) {
            // Show success message
            showResponse(data.message);

            // Remove the user from the pending list on the frontend
            removeUserFromPendingList(id, type);
        }
    } catch (error) {
        // Handle any errors that happen during the request
        showResponse('Error accepting user: ' + error.message);
    }
}



function removeUserFromPendingList(id, type) {
    const userContainer = document.getElementById('pendingUsersList');
    
    // Create a unique selector for the user based on ID and type
    const userElement = document.querySelector(`#user-${id}-${type}`);

    if (userElement) {
        userContainer.removeChild(userElement);
        console.log("Removed user from pending list:", id, type);
    } else {
        console.log("User element not found in the pending list:", id, type);
    }
}




async function rejectUser(event) {
    event.preventDefault();

    const id = document.getElementById('rejectUserId').value;
    const type = document.getElementById('rejectUserType').value;

    try {
        // Step 1: Send the PUT request to reject the user
        const response = await fetch(`http://localhost:5000/api/admin/rejectUser/${id}/${type}`, {
            method: 'PUT',
        });

        // Step 2: Check for successful response
        if (!response.ok) {
            // If the response isn't successful (status 2xx), throw an error
            throw new Error('Failed to reject user');
        }

        // Step 3: Parse the JSON response
        const data = await response.json();
        console.log(data);  // Log the response for debugging

        if (data.message) {
            // Show success message
            showResponse(data.message);

            // Remove the user from the pending list on the frontend
            removeUserFromPendingList(id, type);
        }
    } catch (error) {
        // Handle any errors that happen during the request
        showResponse('Error rejecting user: ' + error.message);
    }
}








// Show a response message to the user
function showResponse(message) {
    const responseSection = document.getElementById('responseSection');
    if (responseSection) {
        document.getElementById('responseMessage').innerText = message;
        responseSection.style.display = 'block';
    } else {
        console.error("Response section not found.");
    }
}
