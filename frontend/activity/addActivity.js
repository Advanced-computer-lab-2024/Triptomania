document.getElementById('activityForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const price = parseFloat(document.getElementById('price').value);
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const specialDiscounts = parseFloat(document.getElementById('specialDiscounts').value);
    const isBookingOpen = document.getElementById('isBookingOpen').checked;

    const activityData = {
        name,
        description,
        date,
        time,
        location,
        price,
        category,
        tags,
        specialDiscounts,
        isBookingOpen
    };

    try {
        const response = await fetch('http://localhost:5000/api/advertiser/activity/addActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        });

        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message;

        if (response.status === 201) {
            document.getElementById('activityForm').reset();
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error adding activity: " + error.message;
    }
});
