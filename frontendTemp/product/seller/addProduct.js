document.getElementById('addProductForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page

    // Collect data from the form
    const productData = {
        Name: document.getElementById('name').value,
        Description: document.getElementById('description').value,
        Price: Number(document.getElementById('price').value),
        Seller: document.getElementById('seller').value,
        Quantity: Number(document.getElementById('quantity').value),
    };

    console.log(productData); // Debugging statement

    try {
        // Send POST request to the backend API
        const response = await fetch('http://localhost:5000/api/seller/product/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData) // Convert form data to JSON
        });

        if (response.ok) {
            const responseData = await response.json(); // Parse the response as JSON
            console.log(responseData); // Log the entire response to check its structure
        
            const productId = responseData.product._id; // Extract the product ID from the product object
        
            if (!productId) {
                alert('Product ID not found in the response.');
                return; // Stop execution if the product ID is not found
            }
            
            alert('Product added successfully');
            // Redirect to the upload picture page with the product ID as a query parameter
            window.location.href = `uploadPicture.html?productId=${productId}`;
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Error adding product. Check console for details.');
        }
        
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error adding product. Check console for details.');
    }
});
