document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Typing Effect ---
    const textToType = "Build. Learn. Replicate.";
    const typeWriterElement = document.getElementById('typewriter');
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            typeWriterElement.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100); 
        }
    }
    setTimeout(typeWriter, 500);

    // --- 2. Modal Logic (Login/Signup & About) ---
    const loginBtn = document.getElementById('login-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn'); // New Button
    
    const authModal = document.getElementById('auth-modal');
    const aboutModal = document.getElementById('about-modal'); // New Modal
    
    const closeButtons = document.querySelectorAll('.close-modal, .close-trigger');
    const switchSignup = document.getElementById('switch-to-signup');
    const switchLogin = document.getElementById('switch-to-login');
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');

    // Open Auth Modal
    if(loginBtn) loginBtn.addEventListener('click', () => {
        authModal.classList.add('active');
    });

    // Open Learn More / Praise Modal
    if(learnMoreBtn) learnMoreBtn.addEventListener('click', () => {
        aboutModal.classList.add('active');
    });

    // Close Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.remove('active');
            aboutModal.classList.remove('active');
        });
    });

    // Switch Forms
    if(switchSignup) switchSignup.addEventListener('click', () => {
        loginBox.classList.add('hidden-box');
        signupBox.classList.remove('hidden-box');
    });

    if(switchLogin) switchLogin.addEventListener('click', () => {
        signupBox.classList.add('hidden-box');
        loginBox.classList.remove('hidden-box');
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target == authModal) authModal.classList.remove('active');
        if (e.target == aboutModal) aboutModal.classList.remove('active');
    });

    // --- 3. Scroll Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    });
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

    // --- 4. Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    });
    counters.forEach(counter => counterObserver.observe(counter));

    // --- 5. Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

    // --- 6. Dark Mode ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const body = document.body;
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }
});