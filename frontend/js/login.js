
        // Login form submission against mock auth
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const errorEl = document.getElementById('login-error');

                const result = MockAuth.login(email, password);
                if (result.ok) {
                    window.location.href = 'dashboard.html';
                } else {
                    errorEl.textContent = result.error;
                    errorEl.classList.remove('hidden');
                }
            });
        }

        // Simple micro-interaction for button feedback
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.98)';
            });
            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'scale(1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    