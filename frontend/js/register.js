
        // Registration form submission against mock auth
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('register-name').value.trim();
                const email = document.getElementById('register-email').value.trim();
                const password = document.getElementById('register-password').value;
                const confirm = document.getElementById('register-confirm').value;
                const errorEl = document.getElementById('register-error');

                if (!name || !email || !password) {
                    errorEl.textContent = 'Please fill in all fields.';
                    errorEl.classList.remove('hidden');
                    return;
                }
                if (password !== confirm) {
                    errorEl.textContent = 'Passwords do not match.';
                    errorEl.classList.remove('hidden');
                    return;
                }

                const result = MockAuth.register(name, email, password);
                if (result.ok) {
                    window.location.href = 'dashboard.html';
                } else {
                    errorEl.textContent = result.error;
                    errorEl.classList.remove('hidden');
                }
            });
        }

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                // Potential for adding dynamic glow or sound effects if needed
            });
        });
    