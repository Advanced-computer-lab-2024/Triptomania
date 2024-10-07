// admin.js
document.getElementById('adminForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const adminName = document.getElementById('adminName').value;
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;

    const data = {
        adminName: adminName,
        adminUsername: adminUsername,
        adminPassword: adminPassword
    };

    try {
        const response = await fetch('http://localhost:5000/api/admin/addAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const messageDiv = document.getElementById('message');

        if (!response.ok) {
            const errorData = await response.json();
            messageDiv.textContent = `Error: ${errorData.message}`;
            messageDiv.classList.add('error');
        } else {
            messageDiv.textContent = 'Admin added successfully!';
            messageDiv.classList.remove('error');
            document.getElementById('adminForm').reset();
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error: ' + error.message;
        document.getElementById('message').classList.add('error');
    }
});

// Back button functionality
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect back to Main page
});
