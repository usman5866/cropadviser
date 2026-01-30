// --- 1. Map Integration ---
// Initialize map centered on India
var map = L.map('map').setView([20.5937, 78.9629], 5);

// Load map tiles (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var marker;

// Handle Map Clicks
map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(4);
    var lng = e.latlng.lng.toFixed(4);
    
    // Update input field
    document.getElementById('location-display').value = `Lat: ${lat}, Lng: ${lng}`;

    // Move marker
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }
});

// --- 2. Crop Recommendation Logic (Database) ---
const cropDatabase = {
    'kharif': {
        'clay': { name: 'Rice (Paddy)', desc: 'Requires plenty of water and clayey soil to hold moisture.' },
        'loamy': { name: 'Sugarcane', desc: 'Thrives in humid climate with well-drained loamy soil.' },
        'sandy': { name: 'Bajra (Pearl Millet)', desc: 'Good for areas with less rainfall and sandy soil.' },
        'black': { name: 'Cotton', desc: 'Best grown in Black Cotton Soil which retains moisture well.' }
    },
    'rabi': {
        'clay': { name: 'Chickpea', desc: 'Cool climate crop that grows well in moisture-retentive soils.' },
        'loamy': { name: 'Wheat', desc: 'The most popular Rabi crop; requires cool winters and loamy soil.' },
        'sandy': { name: 'Mustard', desc: 'Can tolerate drier conditions compared to wheat.' },
        'black': { name: 'Sunflower', desc: 'Can be grown in Rabi season in moisture-retentive black soils.' }
    },
    'zaid': {
        'clay': { name: 'Spinach', desc: 'Short duration leafy vegetable suitable for summer.' },
        'loamy': { name: 'Cucumber', desc: 'Requires well-drained loamy soil and frequent watering.' },
        'sandy': { name: 'Watermelon', desc: 'Perfect for sandy riverbeds during summer heat.' },
        'black': { name: 'Groundnut', desc: 'Can be grown if irrigation is available.' }
    }
};

// --- 3. Frontend Logic ---
document.getElementById('cropForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload

    const season = document.getElementById('season').value;
    const soil = document.getElementById('soil').value;

    // Logic: Look up the crop in our database object
    const recommendation = cropDatabase[season][soil];

    // Display Result
    const resultDiv = document.getElementById('result');
    const outputName = document.getElementById('crop-output');
    const outputDesc = document.getElementById('crop-desc');

    if (recommendation) {
        outputName.textContent = recommendation.name;
        outputDesc.textContent = recommendation.desc;
    } else {
        outputName.textContent = "General Vegetables";
        outputDesc.textContent = "Try growing seasonal vegetables suitable for your local temperature.";
    }

    // Show the hidden result div
    resultDiv.style.display = 'block';
    
    // Smooth scroll to the result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
});