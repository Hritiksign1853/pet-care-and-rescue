// Constants
const API_BASE_URL = 'http://localhost:5500/api';

// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message';
    form.appendChild(statusMessage);

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Booking...';

        // Gather form data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value.replace(/\D/g, ''), // Remove non-digits
            service: form.service.value,
            date: form.date.value,
            time: form.time.value,
            message: form.message.value || ''
        };

        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Appointment booked successfully! We will contact you shortly.', 'success');
                form.reset();
            } else {
                throw new Error(data.error || 'Failed to book appointment');
            }
        } catch (error) {
            showMessage(error.message || 'An error occurred while booking your appointment.', 'error');
            console.error('Booking error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Book Appointment';
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let cleaned = e.target.value.replace(/\D/g, '');
        
        if (cleaned.length > 10) {
            cleaned = cleaned.slice(0, 10);
        }
        e.target.value = cleaned;
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function(e) {
        const email = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            e.target.focus();
        }
    });

    // Time slot validation (8 AM to 6 PM)
    const timeInput = document.getElementById('time');
    timeInput.addEventListener('change', function(e) {
        const time = e.target.value;
        const hour = parseInt(time.split(':')[0]);
        
        if (hour < 8 || hour >= 18) {
            showMessage('Please select a time between 8:00 AM and 6:00 PM', 'error');
            e.target.value = '';
        }
    });

    // Service price display
    const serviceSelect = document.getElementById('service');
    const prices = {
        veterinary: 50,
        grooming: 35,
        training: 45,
        boarding: 40
    };

    serviceSelect.addEventListener('change', function(e) {
        const selectedService = e.target.value;
        const price = prices[selectedService];
        showMessage(`Service price: $${price}`, 'info');
    });

    // Date validation (no weekends)
    dateInput.addEventListener('change', function(e) {
        const selected = new Date(e.target.value);
        const day = selected.getDay();

        if (day === 0 || day === 6) {
            showMessage('We are closed on weekends. Please select a weekday.', 'error');
            e.target.value = '';
        }
    });

    // Form field validation
    function validateForm() {
        const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = form[field];
            if (!input.value.trim()) {
                showMessage(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                isValid = false;
            }
        });

        // Phone number validation
        const phoneRegex = /^[6789]\d{9}$/;
        const phoneInput = form.phone.value.replace(/\D/g, '');
        if (!phoneRegex.test(phoneInput)) {
            showMessage('Please enter a valid 10-digit Indian phone number', 'error');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.value)) {
            showMessage('Please enter a valid email address', 'error');
            isValid = false;
        }

        return isValid;
    }

    // Helper function to show messages
    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 5000);
    }

    // Character limit for message
    const messageInput = document.getElementById('message');
    const maxLength = 500;
    
    messageInput.addEventListener('input', function(e) {
        const remaining = maxLength - e.target.value.length;
        if (remaining < 0) {
            e.target.value = e.target.value.slice(0, maxLength);
            showMessage(`Message cannot exceed ${maxLength} characters`, 'error');
        }
    });

    // Add CSS for status messages
    const style = document.createElement('style');
    style.textContent = `
        .status-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            text-align: center;
        }
        .status-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .status-message.info {
            background-color: #cce5ff;
            color: #004085;
            border: 1px solid #b8daff;
        }
    `;
    document.head.appendChild(style);
});