// =========================================
// 1. INITIALIZATION & NAVIGATION
// =========================================
let map; // Global map variable

function enterDashboard() {
    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app-container');
    
    splash.classList.add('slide-out-up');
    
    setTimeout(() => {
        app.classList.remove('hidden');
        app.classList.add('visible');
        initMap(); // Initialize Map only after visible
        initCharts();
    }, 800);
}

function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active-panel'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-panel');
    
    // Highlight sidebar button
    const buttons = Array.from(document.querySelectorAll('.nav-btn'));
    const activeButton = buttons.find(btn => btn.getAttribute('onclick').includes(tabId));
    if(activeButton) activeButton.classList.add('active');

    // Fix Map Rendering Bug
    if(tabId === 'home' && map) {
        setTimeout(() => map.invalidateSize(), 200);
    }
}

// =========================================
// 2. SMART MAP (Leaflet)
// =========================================
function initMap() {
    if (map) return;
    map = L.map('map').setView([17.3850, 78.4867], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.circleMarker([17.3850, 78.4867], { radius: 8, color: 'white', fillColor: 'blue', fillOpacity: 1 }).addTo(map).bindPopup("<b>Your Farm</b>");
    L.circleMarker([17.4300, 78.4000], { radius: 8, color: 'white', fillColor: 'green', fillOpacity: 1 }).addTo(map).bindPopup("<b>Bowenpally Mandi</b>");
}

// =========================================
// 3. CROP ADVISOR (LOCATION AWARE)
// =========================================
function analyzeCrop(event) {
    event.preventDefault();
    
    const location = document.getElementById('location').value;
    const season = document.getElementById('season').value;
    const soil = document.getElementById('soil').value;
    
    const resultBox = document.getElementById('advisor-result');
    const nameEl = document.getElementById('rec-name');
    const reasonEl = document.getElementById('rec-reason');

    resultBox.classList.remove('hidden');
    nameEl.textContent = "Processing...";
    reasonEl.textContent = "AI is analyzing regional climate data...";

    setTimeout(() => {
        let recName = "Mixed Vegetables";
        let recReason = "Good for general conditions.";

        // --- REGIONAL LOGIC ---
        if (location === 'south') {
            if (season === 'kharif') {
                if (soil === 'black') { recName = "Cotton (Black Gold)"; recReason = "High yield in Telangana Black soil. Market demand is peak."; }
                else if (soil === 'red') { recName = "Groundnut / Chilli"; recReason = "Red soil allows deep root penetration for groundnut."; }
                else { recName = "Paddy (Rice)"; recReason = "Standard crop for South India with irrigation."; }
            } else {
                recName = "Sunflower / Bengal Gram"; recReason = "Ideal for drier Rabi season in Deccan plateau.";
            }
        } 
        else if (location === 'north') {
            if (season === 'rabi') { recName = "Wheat"; recReason = "North Indian winters are perfect for Wheat."; }
            else { recName = "Sugarcane / Maize"; recReason = "High water availability supports these crops."; }
        }
        else if (location === 'coastal') {
            recName = "Paddy / Coconut"; recReason = "High humidity favors these crops.";
        }
        else { // Deccan
             if (soil === 'black') { recName = "Cotton / Soybean"; recReason = "Regur soil retains moisture."; }
             else { recName = "Millets (Jowar)"; recReason = "Drought resistant crop."; }
        }

        nameEl.textContent = recName;
        reasonEl.innerHTML = `<strong>Why?</strong> ${recReason} <br><br><span style="color:#2ecc71">✔ Optimized for ${location.toUpperCase()} region.</span>`;
    }, 1500);
}

// =========================================
// 4. SOIL LAB (VISUAL METER)
// =========================================
function checkSoil() {
    const n = document.getElementById('n-val').value;
    const p = document.getElementById('p-val').value;
    const k = document.getElementById('k-val').value;
    
    const reportBox = document.getElementById('soil-report');
    const tipsList = document.getElementById('soil-tips');
    const statusText = document.getElementById('soil-status-text');
    const healthBar = document.getElementById('health-bar');

    if (!n || !p || !k) {
        alert("Please enter all N-P-K values.");
        return;
    }

    reportBox.classList.remove('hidden');
    tipsList.innerHTML = '';
    healthBar.style.width = '0%';
    statusText.innerText = "Analyzing Samples...";

    setTimeout(() => {
        let tips = "";
        let healthScore = 0;

        // NITROGEN (Ideal: 280-560)
        if (n < 280) { tips += `<li>🔴 <strong>Low Nitrogen:</strong> Add Urea immediately.</li>`; healthScore += 10; }
        else if (n > 560) { tips += `<li>🟠 <strong>High Nitrogen:</strong> Reduce fertilizer.</li>`; healthScore += 20; }
        else { tips += `<li>🟢 <strong>Nitrogen:</strong> Optimal.</li>`; healthScore += 33; }

        // PHOSPHORUS (Ideal: 10-25)
        if (p < 10) { tips += `<li>🔴 <strong>Low Phosphorus:</strong> Add DAP.</li>`; healthScore += 10; }
        else { tips += `<li>🟢 <strong>Phosphorus:</strong> Healthy.</li>`; healthScore += 33; }

        // POTASSIUM (Ideal: 110-280)
        if (k < 110) { tips += `<li>🔴 <strong>Low Potassium:</strong> Add Potash.</li>`; healthScore += 10; }
        else { tips += `<li>🟢 <strong>Potassium:</strong> Good.</li>`; healthScore += 34; }

        tipsList.innerHTML = tips;
        healthBar.style.width = healthScore + '%';
        statusText.innerText = `Soil Health Score: ${healthScore}/100`;

        // Color coding bar
        if(healthScore < 50) healthBar.style.background = "#ff4757"; // Red
        else if(healthScore < 80) healthBar.style.background = "#f1c40f"; // Yellow
        else healthBar.style.background = "#2ecc71"; // Green
        
        reportBox.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// =========================================
// 5. CHART & CHATBOT
// =========================================
function initCharts() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        setTimeout(() => bar.style.height = bar.style.height, 500);
    });
}
function updatePrice(text) {
    document.getElementById('price-display').innerHTML = `Selected: <strong>${text}</strong>`;
}

function toggleChat() {
    const win = document.getElementById('chat-window');
    win.classList.toggle('active');
    if(win.classList.contains('active')) document.getElementById('user-input').focus();
}

function handleEnter(e) { if(e.key === 'Enter') sendMessage(); }

function sendMessage() {
    const input = document.getElementById('user-input');
    const body = document.getElementById('chat-body');
    const txt = input.value.trim().toLowerCase();
    if(!txt) return;

    body.innerHTML += `<div class="msg user"><p>${input.value}</p></div>`;
    input.value = "";
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
        let reply = "I am still learning. Try asking about 'Cotton', 'Weather', or 'Prices'.";
        if(txt.includes('hi') || txt.includes('hello')) reply = "Namaste! How can I help your farm today?";
        else if(txt.includes('cotton')) reply = "Cotton is a cash crop. Ensure proper drainage in black soil.";
        else if(txt.includes('price')) reply = "Current Mandi Prices: \n• Cotton: ₹6,200/qt \n• Rice: ₹2,100/qt";
        else if(txt.includes('weather')) reply = "Forecast: Sunny (29°C). Light rain expected Sunday.";
        
        body.innerHTML += `<div class="msg bot"><p>${reply}</p></div>`;
        body.scrollTop = body.scrollHeight;
    }, 1000);
}

// =========================================
// 6. UTILITIES
// =========================================
function toggleTheme() { document.body.classList.toggle('dark-mode'); }
function changeLanguage() {
    const lang = document.getElementById('lang-selector').value;
    const title = document.querySelector('.welcome-banner h2');
    if(lang === 'te') title.innerText = "నమస్కారం, రైతు!";
    else if(lang === 'hi') title.innerText = "नमस्ते किसान!";
    else title.innerText = "👋 Namaste, Farmer!";
}