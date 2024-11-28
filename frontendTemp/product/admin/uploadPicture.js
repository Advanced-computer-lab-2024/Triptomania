document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadPictureForm');
    const skipButton = document.getElementById('skipButton');

    // Extract the productId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (!productId) {
        alert('Product ID not found.');
        return;
    }

    // Handle form submission for picture upload
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const fileInput = document.getElementById('productImage').files[0];

        if (fileInput) {
            formData.append('file', fileInput); // Add the file to formData

            try {
                const response = await fetch(`http://localhost:5000/api/admin/product/uploadPicture/${productId}`, {
                    method: 'POST',
                    body: formData, // Send the file as FormData
                });

                if (response.ok) {
                    alert('Picture uploaded successfully');
                    window.location.href = 'viewProducts.html'; // Redirect to the product list or another page
                } else {
                    const errorData = await response.json();
                    console.error('Error uploading picture:', errorData);
                    alert('Error uploading picture. Check console for details.');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Error uploading picture. Check console for details.');
            }
        } else {
            alert('Please select a picture to upload.');
        }
    });

    // Handle skip button
    skipButton.addEventListener('click', () => {
        // Redirect to another page or product list if the user skips picture upload
        window.location.href = 'viewProducts.html'; // Adjust the path to your product listing page
    });
});
