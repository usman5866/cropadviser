document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const text = "Build. Learn. Replicate.";
    let i = 0;
    function type() {
        if (i < text.length) {
            document.getElementById('typewriter').innerHTML += text.charAt(i);
            i++; setTimeout(type, 100);
        }
    }
    type();

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    });
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

    // Ripple Effect Logic
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.onclick = function(e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            let ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });
});