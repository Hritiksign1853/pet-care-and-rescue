// Constants
const API_BASE_URL = 'http://localhost:5500/api';

// Handle Contact Form Submission
const contactForm = document.getElementById("contactForm");
const statusMessage = document.createElement('div');
statusMessage.className = 'status-message';
contactForm.appendChild(statusMessage);

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value.replace(/\D/g, ''),
    emergency: document.getElementById("emergency").value,
    message: document.getElementById("message").value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Thank you for your message. We will contact you shortly!' +
        (formData.emergency === "yes" ? 
          '\n\nFor immediate assistance, please call our emergency line: 093246 99829-PETS' : 
          ''), 'success');
      contactForm.reset();
    } else {
      throw new Error(data.error || 'Failed to send message');
    }
  } catch (error) {
    showMessage(error.message || 'An error occurred while sending your message.', 'error');
    console.error('Contact form error:', error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
  }
});

// Form Validation
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.replace(/\D/g, '');
  const emergency = document.getElementById("emergency").value;
  const message = document.getElementById("message").value.trim();

  // Check required fields
  if (!name || !email || !phone || !emergency || !message) {
    showMessage('Please fill in all required fields', 'error');
    return false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', 'error');
    return false;
  }

  // Validate phone (Indian format)
  const phoneRegex = /^[6789]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    showMessage('Please enter a valid 10-digit Indian phone number', 'error');
    return false;
  }

  return true;
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
`;
document.head.appendChild(style);

// Newsletter Form
document.querySelector(".newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.querySelector("input").value;
  if (email) {
    alert("Thank you for subscribing to our newsletter!");
    e.target.reset();
  }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Pet hospital data with Mumbai location and Indian phone numbers
const petHospitals = [
  {
    id: 1,
    name: "Central Pet Hospital",
    address: "123 Main St, Mumbai, MH 400001",
    phone: "+91 98765 43210",
    rating: 4.8,
    openHours: "24/7",
    services: ["Emergency Care", "Surgery", "Dental"],
    coordinates: { lat: 19.0760, lng: 72.8777 },
  },
  {
    id: 2,
    name: "Downtown Veterinary Clinic",
    address: "456 Park Ave, Mumbai, MH 400002",
    phone: "+91 91234 56789",
    rating: 4.6,
    openHours: "8AM - 8PM",
    services: ["Checkups", "Vaccination", "Grooming"],
    coordinates: { lat: 19.0770, lng: 72.8790 },
  },
  {
    id: 3,
    name: "Pet Emergency Center",
    address: "789 Broadway, Mumbai, MH 400003",
    phone: "+91 93456 78901",
    rating: 4.9,
    openHours: "24/7",
    services: ["Emergency Care", "ICU", "Surgery"],
    coordinates: { lat: 19.0755, lng: 72.8765 },
  },
];

// Initialize the page
document.addEventListener("DOMContentLoaded", displayHospitals);

// Display hospitals in the grid
function displayHospitals() {
  const hospitalsContainer = document.getElementById("hospitalsList");
  hospitalsContainer.innerHTML = petHospitals
    .map(
      (hospital) => `
    <div class="hospital-card">
      <h3>${hospital.name}</h3>
      <div class="hospital-info">
        <p>📍 ${hospital.address}</p>
        <p>📞 ${hospital.phone}</p>
        <p>⭐ ${hospital.rating} / 5.0</p>
        <p>🕒 ${hospital.openHours}</p>
        <p>🏥 ${hospital.services.join(", ")}</p>
      </div>
      <div class="hospital-actions">
        <a href="#" onclick="getDirections(${hospital.coordinates.lat}, ${
        hospital.coordinates.lng
      })" class="action-btn directions-btn">Get Directions</a>
        <a href="tel:${hospital.phone.replace(
          /[^0-9]/g,
          ""
        )}" class="action-btn call-btn">Call Now</a>
      </div>
    </div>
  `
    )
    .join("");
}

// Get directions using Google Maps
function getDirections(lat, lng) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.open(
          `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lng}`,
          "_blank"
        );
      },
      () =>
        window.open(`https://www.google.com/maps/dir//${lat},${lng}`, "_blank")
    );
  } else {
    window.open(`https://www.google.com/maps/dir//${lat},${lng}`, "_blank");
  }
}

// Search for nearby hospitals
function findNearbyHospitals() {
  const searchInput = document.getElementById("locationSearch").value.trim();
  if (!searchInput) {
    alert("Please enter a location to search");
    return;
  }
  alert(`Searching for pet hospitals near: ${searchInput}`);
}
// 🏥 Pet Hospital Data (Added More Locations)
var petHospital = [
  { city: "Mumbai" },
  { city: "New Delhi" },
  { city: "New York" },
  { city: "London" },
  { city: "Sydney" },
  { city: "Tokyo" },
  { city: "Dubai" },
  { city: "Paris" }
];

// Function to update Google Maps based on search
function searchLocation() {
  var query = document.getElementById("search").value.trim().toLowerCase();
  var found = petHospital.find(hospital => hospital.city.toLowerCase() === query);

  if (found) {
      document.getElementById("google-map").src = `https://www.google.com/maps?q=pet+hospital+in+${found.city}&output=embed`;
  }
}

// Display hospitals on the map
function displayHospitalsOnMap(hospitals) {
    // Clear existing markers
    clearMarkers();

    hospitals.forEach(hospital => {
        const marker = new google.maps.Marker({
            position: hospital.coordinates,
            map: map,
            title: hospital.name,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
        });

        markers.push(marker);

        // Add click listener to marker
        marker.addListener('click', () => {
            const content = `
                <div class="info-window">
                    <h3>${hospital.name}</h3>
                    <p>📍 ${hospital.address}</p>
                    <p>📞 ${hospital.phone}</p>
                    <p>⭐ ${hospital.rating} / 5.0</p>
                    <p>🕒 ${hospital.openHours}</p>
                    <div class="info-window-actions">
                        <button onclick="getDirections(${hospital.coordinates.lat}, ${hospital.coordinates.lng})">
                            Get Directions
                        </button>
                        <a href="tel:${hospital.phone.replace(/[^0-9]/g, '')}">Call Now</a>
                    </div>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
    });

    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds);
}

// Clear existing markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Search for nearby hospitals
function findNearbyHospitals() {
    const searchInput = document.getElementById('locationSearch').value.trim();
    if (!searchInput) {
        alert('Please enter a location to search');
        return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchInput + ', Mumbai, India' }, (results, status) => {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(13);

            // Find and display nearby hospitals
            const nearbyHospitals = findNearbyHospitalsFromLocation(location);
            displayHospitalsOnMap(nearbyHospitals);
        } else {
            alert('Location not found. Please try again.');
        }
    });
}

// Find hospitals near a location
function findNearbyHospitalsFromLocation(location) {
    return petHospitals.filter(hospital => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(hospital.coordinates),
            location
        );
        // Return hospitals within 5km
        return distance <= 5000;
    });
}

// Initialize map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    displayHospitals(); // This will display the list of hospitals below the map
});

// Add styles for the info window
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    .info-window {
        padding: 10px;
        max-width: 300px;
    }
    .info-window h3 {
        margin: 0 0 10px;
        color: #333;
    }
    .info-window p {
        margin: 5px 0;
        color: #666;
    }
    .info-window-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    .info-window-actions button,
    .info-window-actions a {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        background: #4F46E5;
        color: white;
        text-decoration: none;
        cursor: pointer;
        font-size: 14px;
    }
    .info-window-actions button:hover,
    .info-window-actions a:hover {
        background: #4338CA;
    }
`;
document.head.appendChild(mapStyles);