
        // Micro-interaction for reconstruction effect
        document.addEventListener('mousemove', (e) => {
            const glow = document.querySelector('.glow-point');
            if (glow) {
                const rect = glow.parentElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                    glow.style.transform = `translate(${x}px, ${y}px)`;
                }
            }
        });

        // Background parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.reconstruction-scan');
            if (hero) {
                hero.style.opacity = Math.max(0, 0.8 - scrolled / 500);
            }
        });
    