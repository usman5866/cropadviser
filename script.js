// =========================================
// 1. REPLICODE INTRO LOGIC
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const w1 = document.getElementById('w1');
    const w2 = document.getElementById('w2');
    const w3 = document.getElementById('w3');
    const final = document.getElementById('w-final');

    // Sequence
    setTimeout(() => w1.classList.add('word-anim'), 500);
    setTimeout(() => w2.classList.add('word-anim'), 1500);
    setTimeout(() => w3.classList.add('word-anim'), 2500);
    setTimeout(() => {
        final.classList.remove('hidden');
        final.classList.add('show');
    }, 3500);
});

// =========================================
// 2. APP ENTRY & SCROLL OBSERVER
// =========================================
function enterApp() {
    document.getElementById('splash-screen').style.transform = 'translateY(-100%)';
    document.getElementById('splash-screen').style.transition = 'transform 0.8s ease-in-out';
    
    setTimeout(() => {
        document.getElementById('app-container').classList.remove('hidden');
        initMap();
        setupObserver(); // Start Scroll Animations
        loadMarket();
    }, 500);
}

// The "Replicode" Scroll Animation Trigger
function setupObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
}

// =========================================
// 3. NAVIGATION & TABS
// =========================================
function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active-view'));
    // Show target
    document.getElementById(tabId).classList.add('active-view');
    
    // Update sidebar active state
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Re-trigger scroll animations for new section
    setTimeout(setupObserver, 100);
}

// =========================================
// 4. FEATURES (AI & DIAGNOSTICS)
// =========================================
// Crop Advisor
function analyzeCrop(e) {
    e.preventDefault();
    const res = document.getElementById('advisor-result');
    const title = document.getElementById('rec-crop');
    
    res.classList.remove('hidden');
    title.innerText = "Analyzing Satellite Data...";
    
    setTimeout(() => {
        title.innerText = "Recommended: Cotton (Hybrid)";
        document.getElementById('rec-desc').innerText = "Optimal for current Black Soil & Low Rain conditions.";
        speak("Analysis complete. Cotton is recommended.");
    }, 1500);
}

// Nutrient Engine
function calcNutrients() {
    const stage = document.getElementById('crop-stage').value;
    const res = document.getElementById('nut-res');
    
    res.classList.remove('hidden');
    res.innerHTML = "Processing...";
    
    setTimeout(() => {
        let advice = "Apply NPK 10:26:26 @ 50kg/acre.";
        if(stage === 'flowering') advice = "Spray 13:0:45 (Potassium Nitrate) for grain filling.";
        res.innerHTML = `<strong>RX:</strong> ${advice}`;
        speak("Nutrient schedule generated.");
    }, 1000);
}

// Camera Scanner
function scanDisease(input) {
    if (input.files[0]) {
        const area = document.querySelector('.upload-area');
        area.classList.add('scanning'); // Trigger laser animation
        
        setTimeout(() => {
            area.classList.remove('scanning');
            document.getElementById('scan-res').classList.remove('hidden');
            document.getElementById('dis-name').innerText = "Early Blight (Fungal)";
            speak("Alert. Early Blight detected. Recommend Fungicide application.");
        }, 2000);
    }
}

// =========================================
// 5. VOICE ASSISTANT
// =========================================
let listening = false;

function toggleVoice() {
    const waves = document.getElementById('voice-waves');
    const status = document.getElementById('voice-status');
    
    if(!listening) {
        listening = true;
        waves.classList.add('active');
        status.innerText = "Listening...";
        speak("I am listening.");
        
        // Simulating voice command processing
        setTimeout(() => {
            handleCommand("status");
            listening = false;
            waves.classList.remove('active');
            status.innerText = "Tap to Speak";
        }, 3000);
    }
}

function handleCommand(cmd) {
    if(cmd === "status") {
        speak("System is optimal. No critical alerts nearby.");
    }
}

function speak(text) {
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
}

// =========================================
// 6. UTILS (Map, Theme, Chat)
// =========================================
function initMap() {
    const map = L.map('map').setView([17.3850, 78.4867], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

function loadMarket() {
    const list = document.getElementById('market-list');
    list.innerHTML = `
        <div class="market-item"><img src="https://placehold.co/60x60?text=Rice"><h4>Rice</h4><p class="text-primary">₹2100</p></div>
        <div class="market-item"><img src="https://placehold.co/60x60?text=Cotton"><h4>Cotton</h4><p class="text-primary">₹6200</p></div>
    `;
}

function toggleTheme() { document.body.classList.toggle('dark-mode'); }
function toggleChat() { document.getElementById('chat-ui').classList.toggle('show'); }
function handleChat(e) {
    if(e.key === 'Enter') {
        const txt = e.target.value;
        const box = document.getElementById('chat-msgs');
        box.innerHTML += `<div class="msg user">${txt}</div>`;
        e.target.value = "";
        setTimeout(() => {
            box.innerHTML += `<div class="msg bot">I can help with crop diagnostics.</div>`;
            box.scrollTop = box.scrollHeight;
        }, 1000);
    }
}
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }