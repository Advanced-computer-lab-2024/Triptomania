document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('productList');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const filterButton = document.getElementById('filterButton');

    // Function to fetch all products
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/tourist/product/viewProducts'); // View all products API
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

   // Function to display products with styling
function displayProducts(products) {
    productList.innerHTML = ''; // Clear existing products
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item'); // Assigning class for styling

        // Apply inline styles to match your design if CSS isn't applying
        productElement.style.backgroundColor = '#fff';
        productElement.style.border = '2px solid #007BFF';
        productElement.style.padding = '20px';
        productElement.style.borderRadius = '10px';
        productElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        productElement.style.marginBottom = '20px';
        productElement.style.transition = 'box-shadow 0.3s ease';

        // Edit button redirect to edit page
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.style.backgroundColor = '#007BFF';
        editButton.style.color = 'white';
        editButton.style.padding = '10px';
        editButton.style.marginTop = '10px';
        editButton.style.border = 'none';
        editButton.style.borderRadius = '5px';
        editButton.style.cursor = 'pointer';

        // When clicked, redirect to an edit page with the product ID in the URL
        editButton.addEventListener('click', function() {
            window.location.href = `editProduct.html?id=${product._id}`; // Assuming product._id holds the product ID
        });

        // Create product HTML structure
        productElement.innerHTML = `
            <h2 style="font-size: 1.5em; color: #333; margin-bottom: 10px;">${product.Name}</h2>
            <p style="margin: 5px 0; color: #555;">${product.Description}</p>
            <p style="font-weight: bold; color: #007BFF; font-size: 1.2em;">Price: $${product.Price}</p>
            <p style="font-size: 0.9em; color: #888;">Seller: ${product.Seller}</p>
            <p style="font-size: 0.9em; color: #888;">Ratings: ${product.Ratings}</p>
            <p style="font-size: 0.9em; color: #888;">Reviews: ${product.Reviews}</p>
        `;

        // Append edit button to the product element
        productElement.appendChild(editButton);

        // Hover effect using JavaScript
        productElement.addEventListener('mouseover', function () {
            productElement.style.borderColor = '#0056b3';
            productElement.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.2)';
        });

        productElement.addEventListener('mouseout', function () {
            productElement.style.borderColor = '#007BFF';
            productElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });

        // Append product element to the product list
        productList.appendChild(productElement);
    });
}

 

    // Initial fetch of all products on page load
    fetchProducts();
});
