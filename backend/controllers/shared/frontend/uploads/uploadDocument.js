document.getElementById('uploadDocumentForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userType = document.getElementById('userType').value;
    const userId = document.getElementById('userId').value;
    const documentFile = document.getElementById('documentFile').files[0];

    if (!documentFile) {
        alert('Please select a PDF document to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', documentFile);

    try {
        const response = await fetch(`http://localhost:5000/api/${userType}/uploadDocument/${userId}/${userType}`, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();
        document.getElementById('uploadResult').innerText = data.message;
    } catch (error) {
        console.error('Error uploading document:', error);
        document.getElementById('uploadResult').innerText = 'Failed to upload document.';
    }
});
