// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // Assuming the URL has a parameter like ?id=123

// Function to fetch product details for editing
async function fetchProductDetails() {
    try {
        const response = await fetch(`http://localhost:5000/api/tourist/product/viewProduct/${productId}`); // Fetch product details by ID
        if (response.ok) {
            const product = await response.json();
            populateFormFields(product);
        } else {
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Populate the form with the fetched product details
function populateFormFields(product) {
    document.getElementById('name').value = product.Name;
    document.getElementById('description').value = product.Description;
    document.getElementById('price').value = product.Price;
    document.getElementById('seller').value = product.Seller;
    document.getElementById('quantity').value = product.Quantity;
}

// Event listener for the form submission
document.getElementById('editProductForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page

    // Collect data from the form
    const productData = {
        Name: document.getElementById('name').value,
        Description: document.getElementById('description').value,
        Price: Number(document.getElementById('price').value),
        Seller: document.getElementById('seller').value,
        Quantity: Number(document.getElementById('quantity').value),
    };

    try {
        // Send PUT request to the backend API
        const response = await fetch(`http://localhost:5000/api/admin/product/editProduct/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData) // Convert form data to JSON
        });

        // Handle response from the server
        if (response.ok) {
            alert('Product updated successfully');
            // Optionally redirect to the product list or detail page
            window.location.href = 'adminEdit.html'; // Redirect to product list page
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Error updating product. Check console for details.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error updating product. Check console for details.');
    }
});

// Fetch the product details when the page loads
fetchProductDetails();
