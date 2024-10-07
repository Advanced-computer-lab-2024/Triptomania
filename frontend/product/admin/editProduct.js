document.addEventListener('DOMContentLoaded', async function () {
    const productId = new URLSearchParams(window.location.search).get('id');
    
    // Fetch product details using the ID
    async function fetchProduct() {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/product/viewProducts/${productId}`);
            const product = await response.json();

            if (product) {
                // Populate the form fields with the product details
                document.getElementById('productId').value = product._id;
                document.getElementById('name').value = product.Name || ''; // Fallback to empty string
                document.getElementById('description').value = product.Description || ''; // Fallback to empty string
                document.getElementById('price').value = product.Price || ''; // Fallback to empty string
                document.getElementById('seller').value = product.Seller || ''; // Fallback to empty string
                document.getElementById('quantity').value = product.Quantity || ''; // Fallback to empty string
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    // Handle form submission
    document.getElementById('editProductForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const updatedProduct = {};
        
        // Add only the fields that have values
        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();
        const price = document.getElementById('price').value.trim();
        const seller = document.getElementById('seller').value.trim();
        const quantity = document.getElementById('quantity').value.trim();

        if (name) updatedProduct.Name = name;
        if (description) updatedProduct.Description = description;
        if (price) updatedProduct.Price = price;
        if (seller) updatedProduct.Seller = seller;
        if (quantity) updatedProduct.Quantity = quantity;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/product/editProduct/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            const result = await response.json();
            alert(result.message); // Display success or error message
            if (response.ok) {
                // Optionally redirect back to the product list
                window.location.href = 'productList.html'; // Adjust as needed
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    // Call fetchProduct when the page loads
    fetchProduct();
});
