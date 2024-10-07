// Get references to the HTML elements
const categoryNameInput = document.getElementById('categoryName');
const categoryDescriptionInput = document.getElementById('categoryDescription');
const addCategoryButton = document.getElementById('addCategoryBtn');
const categoryList = document.getElementById('categoryList');
const messageDiv = document.getElementById('message');
const backButton = document.getElementById('backBtn'); // Back button reference

// Function to fetch and display categories
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/activities/getCategories');
        const categories = await response.json();

        categoryList.innerHTML = ''; // Clear existing list

        categories.forEach(category => {
            const listItem = document.createElement('div');
            listItem.classList.add('tag-item');
            listItem.innerHTML = `
                <span>Name: ${category.CategoryName} <br> Description: ${category.CategoryDescription}</span>
                <button onclick="editCategory('${category._id}')">Edit</button>
                <button onclick="deleteCategory('${category._id}')">Delete</button>
            `;
            categoryList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Function to add a new category
async function addCategory() {
    const categoryName = categoryNameInput.value;
    const categoryDescription = categoryDescriptionInput.value;

    const data = {
        categoryName: categoryName,
        categoryDescription: categoryDescription
    };

    try {
        const response = await fetch('http://localhost:5000/api/admin/activities/addCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add category');
        }

        const result = await response.json();
        messageDiv.textContent = result.message; // Show success message
        fetchCategories(); // Refresh the category list
        clearInputs(); // Clear inputs
    } catch (error) {
        console.error('Error adding category:', error.message);
        messageDiv.textContent = error.message; // Show error message
    }
}

// Function to edit an existing category
async function editCategory(id) {
    const newCategoryName = prompt('Enter new category name:');
    const newCategoryDescription = prompt('Enter new category description:');

    const data = {
        categoryName: newCategoryName,
        categoryDescription: newCategoryDescription
    };

    try {
        const response = await fetch(`http://localhost:5000/api/admin/activities/editCategory/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to edit category');
        }

        const result = await response.json();
        messageDiv.textContent = result.message; // Show success message
        fetchCategories(); // Refresh the category list
    } catch (error) {
        console.error('Error editing category:', error.message);
        messageDiv.textContent = error.message; // Show error message
    }
}

// Function to delete a category
async function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/activities/deleteCategory/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete category');
            }

            const result = await response.json();
            messageDiv.textContent = result.message; // Show success message
            fetchCategories(); // Refresh the category list
        } catch (error) {
            console.error('Error deleting category:', error.message);
            messageDiv.textContent = error.message; // Show error message
        }
    }
}

// Clear input fields
function clearInputs() {
    categoryNameInput.value = '';
    categoryDescriptionInput.value = '';
}

// Add event listener for the add button
addCategoryButton.addEventListener('click', addCategory);

// Add event listener for the back button
backButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to index page
});

// Fetch categories on page load
fetchCategories();
