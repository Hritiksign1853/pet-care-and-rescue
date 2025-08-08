// Initialize variables
let selectedAmount = 0;
let isProcessing = false;
let currentStep = 1;

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone number (Indian format)
function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

// Show error message
function showError(element, message) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.add('error');
  
  let errorMessage = formGroup.querySelector('.error-message');
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    formGroup.appendChild(errorMessage);
  }
  errorMessage.textContent = message;
}

// Clear error message
function clearError(element) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.remove('error');
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Update step indicators
function updateSteps(step) {
  const steps = document.querySelectorAll('.step');
  steps.forEach((s, index) => {
    s.classList.toggle('active', index + 1 <= step);
  });
}

// Show success message
function showSuccessMessage(amount, email) {
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  
  const message = document.createElement('div');
  message.className = 'success-message';
  message.innerHTML = `
    <div class="success-icon">✓</div>
    <h3>Thank You!</h3>
    <p>Your donation of ${formatCurrency(amount)} has been processed successfully.</p>
    <p>A confirmation email will be sent to ${email}.</p>
  `;
  
  overlay.appendChild(message);
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }, 3000);
}

// Generate a unique transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

// Handle amount selection
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');

amountButtons.forEach(button => {
  button.addEventListener('click', () => {
    amountButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    selectedAmount = parseInt(button.dataset.amount);
    customAmountInput.value = '';
  });
});

customAmountInput.addEventListener('input', () => {
  amountButtons.forEach(btn => btn.classList.remove('active'));
  selectedAmount = parseInt(customAmountInput.value) || 0;
});

// Handle Payment Method Selection
const paymentMethods = document.getElementsByName('paymentMethod');
const paymentDetails = {
  upi: document.getElementById('upiDetails'),
  qr: document.getElementById('qrDetails'),
  card: document.getElementById('cardDetails'),
  netbanking: document.getElementById('netbankingDetails')
};

function showPaymentDetails(method) {
  Object.values(paymentDetails).forEach(detail => {
    if (detail) {
      detail.style.display = 'none';
    }
  });
  if (paymentDetails[method]) {
    paymentDetails[method].style.display = 'block';
  }
}

paymentMethods.forEach(method => {
  method.addEventListener('change', (e) => {
    showPaymentDetails(e.target.value);
    if (e.target.value === 'netbanking') {
      currentStep = 2;
      updateSteps(currentStep);
    }
  });
});

// Format Card Number
const cardNumber = document.getElementById('cardNumber');
if (cardNumber) {
  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  });
}

// Format Expiry Date
const expiryDate = document.getElementById('expiryDate');
if (expiryDate) {
  expiryDate.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  });
}

// Validate CVV
const cvv = document.getElementById('cvv');
if (cvv) {
  cvv.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    e.target.value = value;
  });
}

// Handle Form Submission
const donationForm = document.getElementById('donationForm');
const donateButton = document.querySelector('.donate-button');

donationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (isProcessing) return;
  
  // Clear previous errors
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const amount = selectedAmount || parseInt(customAmountInput.value);
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  // Validate required fields
  let hasError = false;

  if (!name) {
    showError(document.getElementById('name'), 'Please enter your name');
    hasError = true;
  }

  if (!email || !isValidEmail(email)) {
    showError(document.getElementById('email'), 'Please enter a valid email address');
    hasError = true;
  }

  if (phone && !isValidPhone(phone)) {
    showError(document.getElementById('phone'), 'Please enter a valid 10-digit mobile number');
    hasError = true;
  }

  if (!amount || amount <= 0) {
    showError(customAmountInput, 'Please select or enter a valid donation amount');
    hasError = true;
  }

  // Validate payment details based on method
  switch(paymentMethod) {
    case 'upi':
      const upiId = document.getElementById('upiId').value.trim();
      if (!upiId) {
        showError(document.getElementById('upiId'), 'Please enter your UPI ID');
        hasError = true;
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
        showError(document.getElementById('upiId'), 'Please enter a valid UPI ID');
        hasError = true;
      }
      break;
    case 'card':
      const cardNum = cardNumber.value.replace(/\s/g, '');
      const expiry = expiryDate.value;
      const cvvValue = cvv.value;

      if (!cardNum || cardNum.length !== 16) {
        showError(cardNumber, 'Please enter a valid 16-digit card number');
        hasError = true;
      }

      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        showError(expiryDate, 'Please enter a valid expiry date (MM/YY)');
        hasError = true;
      } else {
        const [month, year] = expiry.split('/');
        const now = new Date();
        const cardDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (cardDate < now) {
          showError(expiryDate, 'Card has expired');
          hasError = true;
        }
      }

      if (!cvvValue || cvvValue.length !== 3) {
        showError(cvv, 'Please enter a valid CVV');
        hasError = true;
      }
      break;
    case 'netbanking':
      if (!document.querySelector('input[name="bank"]:checked')) {
        showError(document.querySelector('.bank-list'), 'Please select your bank');
        hasError = true;
      }
      break;
  }

  if (hasError) return;

  // Show loading state
  isProcessing = true;
  donateButton.classList.add('loading');
  donateButton.disabled = true;

  try {
    // Generate a unique transaction ID
    const transactionId = generateTransactionId();
    
    // Prepare donation data
    const donationData = {
      name,
      email,
      phone,
      amount,
      paymentMethod,
      transactionId
    };
    
    // Send donation data to backend
    const response = await fetch('http://localhost:5500/api/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(donationData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to process donation');
    }

    // Show success message
    donateButton.classList.remove('loading');
    donateButton.classList.add('success');
    donateButton.textContent = '✓ Donation Successful';

    // Show animated success message
    showSuccessMessage(amount, email);
    
    // Reset form after delay
    setTimeout(() => {
      donationForm.reset();
      amountButtons.forEach(btn => btn.classList.remove('active'));
      selectedAmount = 0;
      showPaymentDetails('upi');
      donateButton.classList.remove('success');
      donateButton.textContent = 'Complete Donation';
      currentStep = 1;
      updateSteps(currentStep);
    }, 3000);

  } catch (error) {
    console.error('Donation error:', error);
    alert('An error occurred while processing your donation: ' + error.message);
    donateButton.classList.remove('loading');
  } finally {
    isProcessing = false;
    donateButton.disabled = false;
  }
});

// Initialize with UPI payment details shown and step indicators
showPaymentDetails('upi');
updateSteps(1);