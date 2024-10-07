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
        const response = await fetch('http://localhost:5000/api/admin/product/addProduct', { //api
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData) // Convert form data to JSON
        });

        // Handle response from the server
        if (response.ok) {
            alert('Product added successfully');
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
