document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        const patterns = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength += patterns.length ? 20 : 0;
        strength += patterns.lowercase ? 20 : 0;
        strength += patterns.uppercase ? 20 : 0;
        strength += patterns.numbers ? 20 : 0;
        strength += patterns.special ? 20 : 0;

        return {
            score: strength,
            patterns
        };
    }

    // Update password strength indicator
    function updateStrengthIndicator(password) {
        const { score, patterns } = checkPasswordStrength(password);
        strengthBar.style.width = `${score}%`;

        if (score <= 20) {
            strengthBar.style.backgroundColor = 'var(--danger-color)';
            strengthText.textContent = 'Very weak';
            strengthText.style.color = 'var(--danger-color)';
        } else if (score <= 40) {
            strengthBar.style.backgroundColor = 'var(--danger-color)';
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--danger-color)';
        } else if (score <= 60) {
            strengthBar.style.backgroundColor = 'var(--warning-color)';
            strengthText.textContent = 'Medium';
            strengthText.style.color = 'var(--warning-color)';
        } else if (score <= 80) {
            strengthBar.style.backgroundColor = 'var(--success-color)';
            strengthText.textContent = 'Strong';
            strengthText.style.color = 'var(--success-color)';
        } else {
            strengthBar.style.backgroundColor = 'var(--success-color)';
            strengthText.textContent = 'Very strong';
            strengthText.style.color = 'var(--success-color)';
        }

        return score >= 60;
    }

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
        if (type === 'password') {
            eyeIcon.innerHTML = `
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                <line x1="2" y1="2" x2="22" y2="22"/>
            `;
        }
    });

    // Add input event listeners
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('.icon').style.color = 'var(--primary-color)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.querySelector('.icon').style.color = 'var(--gray-500)';
        });
    });

    // Password strength check on input
    passwordInput.addEventListener('input', () => {
        updateStrengthIndicator(passwordInput.value);
    });

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById('terms').checked;

        // Validation
        let isValid = true;
        let errorMessage = '';

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            isValid = false;
            errorMessage = 'Please fill in all fields.';
        } else if (password !== confirmPassword) {
            isValid = false;
            errorMessage = 'Passwords do not match.';
        } else if (!updateStrengthIndicator(password)) {
            isValid = false;
            errorMessage = 'Please choose a stronger password.';
        } else if (!terms) {
            isValid = false;
            errorMessage = 'Please accept the Terms of Service and Privacy Policy.';
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token
                localStorage.setItem('token', data.token);
                alert('Account created successfully!');
                window.location.href = '/login.html';
            } else {
                alert(data.error || 'Error creating account');
            }
        } catch (error) {
            alert('Error connecting to server');
            console.error('Error:', error);
        }
    });
});