document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    let isAdmin = false;

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            isAdmin = button.dataset.type === 'admin';
        });
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        try {
            const response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    isAdmin
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (remember) {
                    localStorage.setItem('email', email);
                }
                alert('Login successful!');
                window.location.href = 'Admins.html';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server');
        }
    });

    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('.icon').style.color = '#9333ea';
        });

        input.addEventListener('blur', () => {
            input.parentElement.querySelector('.icon').style.color = '#6b7280';
        });
    });

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('email');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
});