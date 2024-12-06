const acceptTerms = async (event) => {
    event.preventDefault();

    const id = document.getElementById('acceptTermsId').value.trim();
    const type = document.getElementById('acceptTermsType').value.trim();

    try {
        let url = '';

        // Construct the correct URL based on the user type
        switch (type) {
            case 'tourGuide':
                url = `http://localhost:5000/api/tourGuide/accept-terms/${type}/${id}`;
                break;
            case 'seller':
                url = `http://localhost:5000/api/seller/accept-terms/${type}/${id}`;
                break;
            case 'advertiser':
                url = `http://localhost:5000/api/advertiser/accept-terms/${type}/${id}`;
                break;
            default:
                throw new Error('Invalid user type');
        }

        const response = await fetch(url, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error('Failed to accept terms');
        }

        const data = await response.json();
        if (data.message) {
            showResponse(data.message);

            // Directly update the UI here (instead of calling updateUserTerms)
            const userStatusElement = document.getElementById('responseMessage');
            userStatusElement.innerHTML = `User with ID ${id} and type ${type} has accepted the terms.`;
        }

    } catch (error) {
        console.error('Error accepting terms:', error);
        showResponse('Error accepting terms: ' + error.message);
    }
};



// Attach the event listener after the function is declared
document.getElementById('acceptTermsForm').addEventListener('submit', acceptTerms);

// Function to show response message in the DOM
function showResponse(message) {
    const responseMessageDiv = document.getElementById('responseMessage');
    responseMessageDiv.textContent = message;  // Show the message in the response div
}
