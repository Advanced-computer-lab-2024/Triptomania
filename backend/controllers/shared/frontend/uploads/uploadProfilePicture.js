document.getElementById('uploadProfilePictureForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userType = document.getElementById('userType').value;
    const userId = document.getElementById('userId').value;
    const profilePicture = document.getElementById('profilePicture').files[0];

    if (!profilePicture) {
        alert('Please select a profile picture to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', profilePicture);

    try {
        const response = await fetch(`http://localhost:5000/api/${userType}/uploadProfilePicture/${userId}/${userType}`, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();
        document.getElementById('uploadResult').innerText = data.message;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        document.getElementById('uploadResult').innerText = 'Failed to upload profile picture.';
    }
});
