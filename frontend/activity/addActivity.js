// Fetch Google Maps API key from the backend
async function fetchApiKey() {
    try {
        const response = await fetch('http://localhost:5000/api/maps-key');
        if (!response.ok) {
            throw new Error('Error fetching the API key');
        }
        const data = await response.json();
        return data.apiKey;  // Return the API key
    } catch (error) {
        console.error("Error loading Google Maps API: ", error);
    }
}

// Initialize the map and autocomplete
async function initMap() {
    const apiKey = await fetchApiKey();  // Get the API key
    if (!apiKey) return;  // If there's no API key, don't proceed

    // Load the Google Maps script dynamically
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Wait for the Google Maps API to load
    script.onload = () => {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });

        const input = document.getElementById('location');
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.createElement('div');
        infowindow.setContent(infowindowContent);

        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, present it on the map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Zoom in closer when a place is selected
            }

            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        });
    };
}

// Handle form submission
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
    const creatorId = document.getElementById('creatorId').value;

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
        isBookingOpen,
        creatorId
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
        document.getElementById('responseMessage').textContent = result.error;

        if (response.status === 201) {
            document.getElementById('activityForm').reset();
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = "Error adding activity: " + error.message;
    }
});

// Load the map once the window is fully loaded
window.onload = initMap;
