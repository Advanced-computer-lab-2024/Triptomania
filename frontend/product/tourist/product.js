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

            productElement.innerHTML = `
                <h2 style="font-size: 1.5em; color: #333; margin-bottom: 10px;">${product.Name}</h2>
                <p style="margin: 5px 0; color: #555;">${product.Description}</p>
                <p style="font-weight: bold; color: #007BFF; font-size: 1.2em;">Price: $${product.Price}</p>
                <p style="font-size: 0.9em; color: #888;">Seller: ${product.Seller}</p>
                <p style="font-size: 0.9em; color: #888;">Ratings: ${product.Ratings}</p>
                <p style="font-size: 0.9em; color: #888;">Reviews: ${product.Reviews}</p>
            `;

            // Hover effect using JavaScript
            productElement.addEventListener('mouseover', function () {
                productElement.style.borderColor = '#0056b3';
                productElement.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.2)';
            });

            productElement.addEventListener('mouseout', function () {
                productElement.style.borderColor = '#007BFF';
                productElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            });

            productList.appendChild(productElement);
        });
    }

    // Event listener for search input
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchProducts(searchTerm); // Call search API
        } else {
            fetchProducts(); // If no search term, fetch all products
        }
    });

    // Function to search products
    async function searchProducts(query) {
        try {
            const response = await fetch(`http://localhost:5000/api/tourist/product/searchProducts?Name=${query}`); // Search API
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    }

    // Function to fetch sorted products using your sorting API
    async function fetchSortedProducts(order) {
        try {
            // Use your sorting API for ratings
            const response = await fetch(`http://localhost:5000/api/tourist/product/sortProducts?order=${order}`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching sorted products:', error);
        }
    }

    // Event listener for sorting select
    sortSelect.addEventListener('change', async function () {
        if (sortSelect.value === 'high') {
            await fetchSortedProducts('high'); // Sort by high to low using your API
        } else if (sortSelect.value === 'low') {
            await fetchSortedProducts('low'); // Sort by low to high using your API
        } else {
            await fetchProducts(); // If no sorting, fetch all products
        }
    });

    // Initial fetch of all products on page load
    fetchProducts();
});