// =========================================
// 1. SYSTEM INIT & TILT EFFECT
// =========================================
let map;

function enterDashboard() {
    document.getElementById('splash-screen').classList.add('slide-up-exit');
    setTimeout(() => {
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('visible');
        initMap();
        loadMarketDefaults();
        initTiltEffect(); // Enable Tilt
    }, 800);
}

// 3D Tilt Effect
function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active-panel'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active-panel');
    const btns = Array.from(document.querySelectorAll('.nav-item'));
    const btn = btns.find(b => b.getAttribute('onclick').includes(tabId));
    if(btn) btn.classList.add('active');
    if(tabId === 'home' && map) setTimeout(() => map.invalidateSize(), 200);
}

// =========================================
// 2. THEME TOGGLE (Sun/Moon)
// =========================================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('theme-icon');
    
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        // Light Map
        if(map) {
            map.eachLayer(function (layer) { map.removeLayer(layer); });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        // Dark Map
        if(map) {
            map.eachLayer(function (layer) { map.removeLayer(layer); });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        }
    }
    // Re-add markers
    addMarkers();
}

// =========================================
// 3. INTELLIGENT MAP
// =========================================
function initMap() {
    if (map) return;
    map = L.map('map').setView([17.3850, 78.4867], 10);
    // Default Dark
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    addMarkers();
}

function addMarkers() {
    L.circleMarker([17.3850, 78.4867], { radius: 8, color: '#00e676', fillColor: '#00e676', fillOpacity: 0.8 }).addTo(map).bindPopup("<b>Your Farm</b>");
    L.circleMarker([17.4300, 78.4000], { radius: 8, color: '#2979ff', fillColor: '#2979ff', fillOpacity: 0.8 }).addTo(map).bindPopup("<b>City Mandi</b>");
}

// =========================================
// 4. AI CROP ADVISOR
// =========================================
function analyzeCrop(e) {
    e.preventDefault();
    const loc = document.getElementById('location').value;
    const season = document.getElementById('season').value;
    const soil = document.getElementById('soil').value;
    const rain = document.getElementById('rainfall').value;

    const resBox = document.getElementById('advisor-result');
    const nameEl = document.getElementById('rec-name');
    const reasonEl = document.getElementById('rec-reason');

    resBox.classList.remove('hidden');
    nameEl.innerText = "Analyzing...";
    reasonEl.innerText = "Processing Data...";

    setTimeout(() => {
        let crop = "Millets";
        let reason = "Resilient to current conditions.";

        if (loc === 'south' && season === 'kharif') {
            if (soil === 'black' && rain === 'low') { crop = "Cotton"; reason = "Perfect match for black soil moisture retention."; }
            else if (soil === 'red') { crop = "Groundnut"; reason = "Red soil allows root spread."; }
            else { crop = "Paddy"; reason = "Standard irrigated crop."; }
        } else if (loc === 'north' && season === 'rabi') {
            crop = "Wheat"; reason = "Cool winters optimize yield.";
        }

        nameEl.innerHTML = `<span style="color:var(--neon-green)">${crop}</span>`;
        reasonEl.innerHTML = `AI Confidence: 98% based on ${rain} rainfall.`;
    }, 1500);
}

// =========================================
// 5. SOIL LAB
// =========================================
function checkSoil() {
    const n = parseInt(document.getElementById('n-val').value);
    const p = parseInt(document.getElementById('p-val').value);
    const k = parseInt(document.getElementById('k-val').value);
    
    if(isNaN(n) || isNaN(p) || isNaN(k)) { alert("Enter N-P-K data."); return; }

    const res = document.getElementById('soil-report');
    const bar = document.getElementById('health-bar');
    const status = document.getElementById('soil-status-text');
    const tips = document.getElementById('soil-tips');

    res.classList.remove('hidden');
    bar.style.width = "0%";

    setTimeout(() => {
        let score = 0;
        let advice = "";

        if(n >= 280 && n <= 560) { score += 33; advice += "<li>✅ Nitrogen Optimal</li>"; }
        else { advice += "<li>⚠️ Nitrogen Imbalance: Use Urea.</li>"; }

        if(p >= 10 && p <= 25) { score += 33; advice += "<li>✅ Phosphorus Optimal</li>"; }
        else { advice += "<li>⚠️ Phosphorus Low: Add DAP.</li>"; }

        if(k >= 110) { score += 34; advice += "<li>✅ Potassium Good</li>"; }
        else { advice += "<li>⚠️ Potassium Low: Add Potash.</li>"; }

        bar.style.width = score + "%";
        status.innerHTML = `Soil Score: <strong style="color:${score > 70 ? '#00e676' : '#ef4444'}">${score}/100</strong>`;
        tips.innerHTML = advice;
    }, 1000);
}

// =========================================
// 6. MARKET & CHAT
// =========================================
function loadMarketDefaults() {
    const list = document.getElementById('market-listings');
    list.innerHTML = `
        <div class="market-item">
            <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150">
            <h5>Prem. Rice</h5>
            <p style="color:var(--neon-green)">₹2100</p>
            <button class="btn-outline" style="font-size:0.7rem; margin-top:5px">Buy</button>
        </div>
    `;
}

function updatePrice(p) { document.getElementById('price-display').innerHTML = `Selected: <strong>${p}/qt</strong>`; }

function toggleChat() { document.getElementById('chat-window').classList.toggle('active'); }
function handleEnter(e) { if(e.key === 'Enter') sendMessage(); }
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-body');
    if(!input.value) return;
    box.innerHTML += `<div class="msg user">${input.value}</div>`;
    setTimeout(() => {
        box.innerHTML += `<div class="msg bot">I can analyze soil or prices. Try the tabs!</div>`;
        box.scrollTop = box.scrollHeight;
        input.value = "";
    }, 1000);
}

// Modals
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function confirmSell() { closeModal('sell-modal'); alert("Listed on Market!"); }

function changeLanguage() {
    const t = document.getElementById('welcome-text');
    const l = document.getElementById('lang-selector').value;
    if(l === 'te') t.innerText = "నమస్కారం, రైతు!";
    else if(l === 'hi') t.innerText = "नमस्ते किसान!";
    else t.innerText = "Hello, Farmer!";
}