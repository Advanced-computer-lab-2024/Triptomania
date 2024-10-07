// userAccounts.js

const userList = document.getElementById('userList');
const messageDiv = document.getElementById('message');

// Function to fetch users from the API
async function fetchUsers() {
    try {
        const responseTourists = await fetch('http://localhost:5000/api/admin/getTourists');
        const responseSellers = await fetch('http://localhost:5000/api/admin/getSellers');
        const responseGuides = await fetch('http://localhost:5000/api/admin/getTourGuides');
        const responseAdvertisers = await fetch('http://localhost:5000/api/admin/getAdvertisers');

        const tourists = await responseTourists.json();
        const sellers = await responseSellers.json();
        const guides = await responseGuides.json();
        const advertisers = await responseAdvertisers.json();

        // Combine all users into a single array
        const allUsers = [
            ...tourists.map(user => ({ ...user, type: 'tourist' })),
            ...sellers.map(user => ({ ...user, type: 'seller' })),
            ...guides.map(user => ({ ...user, type: 'tourGuide' })),
            ...advertisers.map(user => ({ ...user, type: 'advertiser' }))
        ];

        displayUsers(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        messageDiv.textContent = 'Error fetching users. Please try again later.';
    }
}

// Function to display users
function displayUsers(users) {
    userList.innerHTML = ''; // Clear existing list
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('tag-item');
        userItem.innerHTML = `
            <span>
                <strong>Username:</strong> ${user.username || 'N/A'} <br>
                <strong>ID:</strong> ${user._id} <br> 
                <strong>Type:</strong> ${user.type}
            </span>
            <button class="delete-button" onclick="deleteUser('${user._id}', '${user.type}')">Delete</button>
        `;
        userList.appendChild(userItem);
    });
}

// Function to delete a user
async function deleteUser(id, type) {
    console.log('Deleting user with ID:', id, 'and type:', type);

    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        try {
            const response = await fetch('http://localhost:5000/api/admin/deleteAccount', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, type }),
            });

            const data = await response.json();
            if (response.ok) {
                messageDiv.textContent = data.message; // Show success message
                fetchUsers(); // Refresh the user list
            } else {
                messageDiv.textContent = data.message || 'Failed to delete user.';
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            messageDiv.textContent = 'Error deleting user. Please try again later.';
        }
    }
}

// Fetch users when the page loads
fetchUsers();

// Add back button functionality
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to the main dashboard
});
