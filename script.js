document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const hoverTargets = document.querySelectorAll('.hover-target, .btn, a, .feature-card');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            follower.classList.add('active');
        });
        target.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
        });
    });

    // --- 2. Ripple Effect ---
    const rippleBtns = document.querySelectorAll('.ripple-btn');
    rippleBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            let ripples = document.createElement('span');
            ripples.classList.add('ripple');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // --- 3. Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        document.querySelector('.scroll-progress').style.width = scrolled + '%';
    });

    // --- 4. Typing Effect ---
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

    // --- 5. Modal Logic ---
    const loginBtn = document.getElementById('login-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const authModal = document.getElementById('auth-modal');
    const aboutModal = document.getElementById('about-modal');
    const featureModal = document.getElementById('feature-modal');
    const closeButtons = document.querySelectorAll('.close-modal, .close-trigger');
    const switchSignup = document.getElementById('switch-to-signup');
    const switchLogin = document.getElementById('switch-to-login');
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');

    if(loginBtn) loginBtn.addEventListener('click', () => authModal.classList.add('active'));
    if(learnMoreBtn) learnMoreBtn.addEventListener('click', () => aboutModal.classList.add('active'));

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.remove('active');
            aboutModal.classList.remove('active');
            featureModal.classList.remove('active');
        });
    });

    if(switchSignup) switchSignup.addEventListener('click', () => {
        loginBox.classList.add('hidden-box');
        signupBox.classList.remove('hidden-box');
    });
    if(switchLogin) switchLogin.addEventListener('click', () => {
        signupBox.classList.add('hidden-box');
        loginBox.classList.remove('hidden-box');
    });

    window.addEventListener('click', (e) => {
        if (e.target == authModal) authModal.classList.remove('active');
        if (e.target == aboutModal) aboutModal.classList.remove('active');
        if (e.target == featureModal) featureModal.classList.remove('active');
    });

    // --- 6. Feature Modal Logic ---
    window.openFeatureModal = function(type) {
        const title = document.getElementById('feature-title');
        const desc = document.getElementById('feature-desc');
        const data = document.getElementById('feature-data');
        if (type === 'learn') {
            title.innerText = "Learn by Doing";
            desc.innerText = "Active recall is the key. Stop watching, start typing.";
            data.innerHTML = "500+ Coding Challenges";
        } else if (type === 'projects') {
            title.innerText = "Project Examples";
            desc.innerText = "Clone real apps like Netflix, Spotify, and Uber.";
            data.innerHTML = "50+ Full Stack Projects";
        } else if (type === 'easy') {
            title.innerText = "Easy to Follow";
            desc.innerText = "Step-by-step guides that respect your time.";
            data.innerHTML = "Beginner Friendly Docs";
        }
        featureModal.classList.add('active');
    }

    // --- 7. Scroll Animation (Staggered) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on index for staggered effect
                entry.target.style.transitionDelay = `${index * 0.1}s`; 
                entry.target.classList.add('show');
            }
        });
    });
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

    // --- 8. Counter Animation ---
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

    // --- 9. Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

    // --- 10. Dark Mode ---
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