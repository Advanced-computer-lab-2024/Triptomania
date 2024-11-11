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
            const response = await fetch('http://localhost:5000/api/seller/product/viewProducts/6700fdfb48a56dba84ece11c'); // View all products API
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Function to check if a string is valid Base64
    function isBase64(string) {
        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        return base64Regex.test(string);
    }

    // Function to display products with styling
    function displayProducts(products) {
        productList.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');

            productElement.style.backgroundColor = '#fff';
            productElement.style.border = '2px solid #007BFF';
            productElement.style.padding = '20px';
            productElement.style.borderRadius = '10px';
            productElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            productElement.style.marginBottom = '20px';
            productElement.style.transition = 'box-shadow 0.3s ease';

            // Check for product image (if it's valid Base64)
            let imageHtml;
            if (product.Picture && isBase64(product.Picture)) {
                imageHtml = `<img src="data:image/jpeg;base64,${product.Picture}" alt="${product.Name}" class="product-image">`;
            } else {
                imageHtml = `<p>No picture added</p>`;
            }

            // Add product details along with the image
            productElement.innerHTML = `
        ${imageHtml}
        <h2 style="font-size: 1.5em; color: #333; margin-bottom: 10px;">${product.Name}</h2>
        <p style="margin: 5px 0; color: #555;">${product.Description}</p>
        <p style="font-weight: bold; color: #007BFF; font-size: 1.2em;">Price: $${product.Price}</p>
        <p style="font-size: 0.9em; color: #888;">Ratings: ${product.Ratings}</p>
        <p style="font-size: 0.9em; color: #888;">Reviews: ${product.Reviews}</p>
        <p style="font-size: 0.9em; color: #888;">Sales: ${product.Sales}</p>
        <p style="font-size: 0.9em; color: #888;">Quantity: ${product.Quantity}</p>
        <button class="archive-button" data-id="${product._id}" style="display: inline-block; margin-top: 10px; background-color: #007BFF; color: white; padding: 10px 15px; border-radius: 5px; border: none; cursor: pointer;">
            ${product.Archive ? 'Unarchive' : 'Archive'}
        </button>
        <a href="editProduct.html?id=${product._id}" style="display: inline-block; margin-top: 10px; background-color: #007BFF; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Edit</a>
    `;

            // Event listener for each archive button
            const archiveButton = productElement.querySelector('.archive-button');
            archiveButton.addEventListener('click', async function () {
                const productId = this.getAttribute('data-id');
                try {
                    const response = await fetch(`http://localhost:5000/api/seller/product/archive/${productId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        alert('Product archived/unarchived successfully');
                        fetchProducts(); // Refresh product list
                    } else {
                        alert('Failed to archive/unarchive product');
                    }
                } catch (error) {
                    console.error('Error archiving/unarchiving product:', error);
                }
            });

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
            const response = await fetch(`http://localhost:5000/api/seller/product/searchProducts?Name=${query}`); // Search API
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    }

    // Function to fetch sorted products
    async function fetchSortedProducts(order) {
        try {
            const response = await fetch(`http://localhost:5000/api/seller/product/sortProducts?order=${order}`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching sorted products:', error);
        }
    }

    // Event listener for sorting select
    sortSelect.addEventListener('change', async function () {
        if (sortSelect.value === 'high') {
            await fetchSortedProducts("high");
        } else if (sortSelect.value === 'low') {
            await fetchSortedProducts("low");
        } else {
            await fetchProducts();
        }
    });

    // Function to filter products by price
    async function filterProducts(min, max) {
        try {
            const response = await fetch(`http://localhost:5000/api/seller/product/filterProducts?minPrice=${min}&maxPrice=${max}`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    }


    // Event listener for filter button
    filterButton.addEventListener('click', function () {
        const min = parseFloat(minPrice.value) || 0; // Default to 0 if empty
        const max = parseFloat(maxPrice.value) || Infinity; // Default to Infinity if empty
        filterProducts(min, max);
    });

    // Initial fetch of all products on page load
    fetchProducts();
});
