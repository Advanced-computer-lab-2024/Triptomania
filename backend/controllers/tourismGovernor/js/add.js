document.getElementById("addPlaceForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('http://localhost:5000/api/tourismGoverner/addHistoricalPlace', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.status) {
        window.location.href = "index.html";
    } else {
        alert(result.error);
    }
});
