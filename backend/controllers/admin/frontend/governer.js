// governor.js
document.getElementById('governorForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('governorName').value;
    const username = document.getElementById('governorUsername').value;
    const password = document.getElementById('governorPassword').value;

    const data = {
        tourismGovernerName: name,
        tourismGovernerUsername: username,
        tourismGovernerPassword: password
    };

    try {
        const response = await fetch('http://localhost:5000/api/admin/addTourismGoverner', {
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
            messageDiv.textContent = 'Tourism Governor added successfully!';
            messageDiv.classList.remove('error');
            document.getElementById('governorForm').reset(); // Clear the form fields after successful submission
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
