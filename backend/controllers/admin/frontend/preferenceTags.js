// preferenceTags.js
const apiUrl = 'http://localhost:5000/api/admin/tags';

// Function to fetch and display preference tags
async function fetchTags() {
    const response = await fetch(`${apiUrl}/getPreferenceTags`);
    const tags = await response.json();
    const tagsList = document.getElementById('tagsList');
    tagsList.innerHTML = '';

    tags.forEach(tag => {
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tag-item';
        tagDiv.innerHTML = `
            <span>Name: ${tag.PreferenceTagName} <br> Description: ${tag.PreferenceTagDescription}</span>
            <button onclick="editTag('${tag._id}', '${tag.PreferenceTagName}', '${tag.PreferenceTagDescription}')">Edit</button>
            <button onclick="deleteTag('${tag._id}')">Delete</button>
        `;
        tagsList.appendChild(tagDiv);
    });
}

// Function to add a new preference tag
document.getElementById('addTagForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const tagName = document.getElementById('tagName').value;
    const tagDescription = document.getElementById('tagDescription').value;

    const data = {
        preferenceTagName: tagName,
        preferenceTagDescription: tagDescription,
    };

    const response = await fetch(`${apiUrl}/addPreferenceTag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const messageDiv = document.getElementById('message');

    if (!response.ok) {
        const errorData = await response.json();
        messageDiv.textContent = `Error: ${errorData.message}`;
        messageDiv.classList.add('error');
    } else {
        messageDiv.textContent = 'Preference Tag added successfully!';
        messageDiv.classList.remove('error');
        document.getElementById('addTagForm').reset(); // Clear the form
        fetchTags(); // Refresh the tags list
    }
});

// Function to edit a preference tag
async function editTag(id, currentName, currentDescription) {
    const newName = prompt('Enter new tag name:', currentName);
    const newDescription = prompt('Enter new tag description:', currentDescription);

    if (newName && newDescription) {
        const data = {
            preferenceTagName: newName,
            preferenceTagDescription: newDescription,
        };

        const response = await fetch(`${apiUrl}/editPreferenceTag/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Preference Tag updated successfully!');
            fetchTags(); // Refresh the tags list
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    }
}

// Function to delete a preference tag
async function deleteTag(id) {
    const confirmDelete = confirm('Are you sure you want to delete this tag?');
    if (confirmDelete) {
        const response = await fetch(`${apiUrl}/deletePreferenceTag/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Preference Tag deleted successfully!');
            fetchTags(); // Refresh the tags list
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    }
}

// Back button functionality
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect back to Main page
});

// Fetch the tags when the page loads
fetchTags();
