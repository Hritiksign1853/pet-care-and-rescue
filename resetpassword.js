document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetPasswordForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    // Password requirement elements
    const lengthReq = document.getElementById('lengthReq');
    const upperReq = document.getElementById('upperReq');
    const lowerReq = document.getElementById('lowerReq');
    const numberReq = document.getElementById('numberReq');
    const specialReq = document.getElementById('specialReq');

    // Password requirements checker
    function checkPasswordRequirements(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update requirement indicators
        lengthReq.classList.toggle('valid', requirements.length);
        upperReq.classList.toggle('valid', requirements.uppercase);
        lowerReq.classList.toggle('valid', requirements.lowercase);
        numberReq.classList.toggle('valid', requirements.number);
        specialReq.classList.toggle('valid', requirements.special);

        return requirements;
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        const requirements = checkPasswordRequirements(password);
        let strength = 0;

        // Calculate strength based on requirements
        strength += requirements.length ? 20 : 0;
        strength += requirements.uppercase ? 20 : 0;
        strength += requirements.lowercase ? 20 : 0;
        strength += requirements.number ? 20 : 0;
        strength += requirements.special ? 20 : 0;

        return {
            score: strength,
            requirements
        };
    }

    // Update password strength indicator
    function updateStrengthIndicator(password) {
        const { score } = checkPasswordStrength(password);
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

        return score >= 60; // Returns true if password is at least medium strength
    }

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
        
        // Update icon
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
    const inputs = document.querySelectorAll('input[type="password"]');
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
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validation
        let isValid = true;
        let errorMessage = '';

        if (!password || !confirmPassword) {
            isValid = false;
            errorMessage = 'Please fill in all fields.';
        } else if (password !== confirmPassword) {
            isValid = false;
            errorMessage = 'Passwords do not match.';
        } else if (!updateStrengthIndicator(password)) {
            isValid = false;
            errorMessage = 'Please choose a stronger password.';
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // If validation passes, you would typically send this data to your server
        console.log('Password reset submitted');

        // For demo purposes, show success message
        alert('Password reset successfully!');
        resetForm.reset();
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Password strength';
        strengthText.style.color = 'var(--text-secondary)';
        
        // Reset requirement indicators
        [lengthReq, upperReq, lowerReq, numberReq, specialReq].forEach(req => {
            req.classList.remove('valid');
        });
    });
});