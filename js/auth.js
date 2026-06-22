/* ==========================================
   AUTH JAVASCRIPT - Sign In / Sign Up
========================================== */

const roleDashboards = {
    admin: 'dashboard.html',
    photographer: 'dash-photographer.html',
    customer: 'dash-customer.html'
};

// Redirect to role-based dashboard if already logged in
const storedRole = localStorage.getItem('lensflare_role');
if (localStorage.getItem('lensflare_user')) {
    window.location.href = storedRole ? (roleDashboards[storedRole] || 'dashboard.html') : 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', () => {

    // Floating Labels
    document.querySelectorAll('.form-control-auth').forEach(input => {
        if (input.value.trim() !== '') {
            input.setAttribute('placeholder', ' ');
        }
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Password Toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'bi bi-eye';
            }
        });
    });

    // Password Strength (Signup)
    const passwordInput = document.querySelector('#signupPassword');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.password-strength-text');

    if (passwordInput && strengthBars.length) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let strength = 0;

            if (val.length >= 6) strength++;
            if (val.length >= 10) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            strengthBars.forEach((bar, i) => {
                bar.className = 'strength-bar';
                if (i < strength) {
                    if (strength <= 2) bar.classList.add('weak');
                    else if (strength <= 3) bar.classList.add('medium');
                    else bar.classList.add('strong');
                }
            });

            if (strengthText) {
                const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
                strengthText.textContent = val ? `Password strength: ${labels[strength]}` : '';
                strengthText.style.color = val ? ['', '#FF6B6B', '#FFD700', '#FFD700', '#4CAF50', '#4CAF50'][strength] : '';
            }
        });
    }

    // Form Validation
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-auth');
            let valid = true;

            // Basic validation
            form.querySelectorAll('.form-control-auth[required]').forEach(input => {
                const errorMsg = input.parentElement.querySelector('.error-msg');
                if (!input.value.trim()) {
                    input.classList.add('error');
                    if (errorMsg) errorMsg.classList.add('show');
                    valid = false;
                } else {
                    input.classList.remove('error');
                    if (errorMsg) errorMsg.classList.remove('show');
                }

                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        input.classList.add('error');
                        if (errorMsg) {
                            errorMsg.textContent = 'Please enter a valid email';
                            errorMsg.classList.add('show');
                        }
                        valid = false;
                    }
                }

                // Password match (signup confirm)
                if (input.id === 'signupConfirm') {
                    const password = document.querySelector('#signupPassword');
                    if (password && input.value !== password.value) {
                        input.classList.add('error');
                        if (errorMsg) {
                            errorMsg.textContent = 'Passwords do not match';
                            errorMsg.classList.add('show');
                        }
                        valid = false;
                    }
                }
            });

            // Terms checkbox (signup)
            const termsCheck = form.querySelector('#termsCheck');
            if (termsCheck && !termsCheck.checked) {
                valid = false;
                termsCheck.style.outline = '2px solid var(--secondary)';
                setTimeout(() => { termsCheck.style.outline = ''; }, 2000);
            }

            if (valid) {
                // Show loading
                btn.classList.add('loading');
                btn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    btn.classList.remove('loading');
                    btn.disabled = false;

                    const card = form.closest('.auth-card');
                    const header = card.querySelector('.auth-header');
                    const formEl = form;

                    if (form.id === 'signupForm') {
                        // Signup success — redirect to signin
                        header.innerHTML = `
                            <div class="success-check">
                                <i class="bi bi-check-lg"></i>
                            </div>
                            <h4>Account Created!</h4>
                            <p>Redirecting to sign in...</p>
                        `;
                        formEl.style.display = 'none';
                        setTimeout(() => {
                            window.location.href = 'signin.html';
                        }, 2000);
                    } else {
                        // Signin success — store user + role and go to dashboard
                        const emailInput = form.querySelector('#signinEmail');
                        const email = emailInput ? emailInput.value.trim() : '';
                        const userName = email ? email.split('@')[0] : 'Photographer';
                        const roleInput = form.querySelector('input[name="signinRole"]:checked');
                        const role = roleInput ? roleInput.value : 'customer';
                        localStorage.setItem('lensflare_user', userName);
                        localStorage.setItem('lensflare_email', email);
                        localStorage.setItem('lensflare_role', role);

                        const dashUrl = roleDashboards[role] || 'dashboard.html';

                        header.innerHTML = `
                            <div class="success-check">
                                <i class="bi bi-check-lg"></i>
                            </div>
                            <h4>Welcome Back!</h4>
                            <p>Redirecting to your dashboard...</p>
                        `;
                        formEl.style.display = 'none';
                        setTimeout(() => {
                            window.location.href = dashUrl;
                        }, 2000);
                    }
                }, 1500);
            }
        });
    });

    // Real-time Field Validation
    document.querySelectorAll('.form-control-auth').forEach(input => {
        input.addEventListener('blur', () => {
            const errorMsg = input.parentElement.querySelector('.error-msg');
            if (input.value.trim() && input.hasAttribute('required')) {
                input.classList.remove('error');
                if (errorMsg) errorMsg.classList.remove('show');
            }
        });

        // Email real-time validation
        if (input.type === 'email') {
            input.addEventListener('blur', () => {
                const errorMsg = input.parentElement.querySelector('.error-msg');
                if (input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        input.classList.add('error');
                        if (errorMsg) {
                            errorMsg.textContent = 'Please enter a valid email';
                            errorMsg.classList.add('show');
                        }
                    }
                }
            });
        }
    });

});
