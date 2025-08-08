document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const requestForm = document.getElementById('requestForm');
    const successMessage = document.getElementById('successMessage');
    const confirmationEmail = document.getElementById('confirmationEmail');
    const emailInput = document.getElementById('email');

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (email) {
            // Here you would typically make an API call to your backend
            // For demo purposes, we'll just show the success message
            requestForm.style.display = 'none';
            successMessage.classList.remove('hidden');
            confirmationEmail.textContent = email;
            
            // Reset form
            resetForm.reset();
        }
    });

    // Add focus effects for input
    emailInput.addEventListener('focus', () => {
        emailInput.parentElement.querySelector('.icon').style.color = 'var(--primary-color)';
    });

    emailInput.addEventListener('blur', () => {
        emailInput.parentElement.querySelector('.icon').style.color = 'var(--gray-500)';
    });
});