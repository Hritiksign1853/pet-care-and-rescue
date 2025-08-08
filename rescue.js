// Success Stories Data
const successStories = [
  {
    id: 1,
    name: "Rocky's Journey",
    date: "March 15, 2024",
    description: "Found abandoned and injured, Rocky made a full recovery and found his forever home.",
    imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 2,
    name: "Luna's Second Chance",
    date: "March 10, 2024",
    description: "Rescued from a hoarding situation, Luna now brings joy to her new family.",
    imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: 3,
    name: "Max's Recovery",
    date: "March 5, 2024",
    description: "After months of rehabilitation, Max found his perfect match with a loving family.",
    imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=500"
  }
];

// API Configuration
const API_URL = 'http://localhost:5500/api/rescue'; // Change this to your actual API URL

// Initialize Success Stories
const storiesGrid = document.querySelector('.stories-grid');

successStories.forEach(story => {
  const storyCard = document.createElement('div');
  storyCard.className = 'story-card';
  storyCard.innerHTML = `
    <img src="${story.imageUrl}" alt="${story.name}">
    <div class="story-content">
      <h3>${story.name}</h3>
      <div class="date">${story.date}</div>
      <p>${story.description}</p>
    </div>
  `;
  storiesGrid.appendChild(storyCard);
});

// Fetch Success Stories from API
async function fetchSuccessStories() {
  try {
    const response = await fetch(`${API_URL}/success-stories`);
    if (!response.ok) {
      throw new Error('Failed to fetch success stories');
    }
    const data = await response.json();
    
    // If we have stories from the API, clear the default ones and display the API ones
    if (data && data.length > 0) {
      storiesGrid.innerHTML = '';
      data.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.innerHTML = `
          <img src="${story.imageUrl}" alt="${story.name}">
          <div class="story-content">
            <h3>${story.name}</h3>
            <div class="date">${new Date(story.date).toLocaleDateString()}</div>
            <p>${story.description}</p>
          </div>
        `;
        storiesGrid.appendChild(storyCard);
      });
    }
  } catch (error) {
    console.error('Error fetching success stories:', error);
    // Keep the default stories if API fails
  }
}

// Fetch Statistics from API
async function fetchStatistics() {
  try {
    const response = await fetch(`${API_URL}/statistics`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    const data = await response.json();
    
    // Update statistics with data from API
    if (data) {
      const statsElements = document.querySelectorAll('.stat-number');
      if (data.petsRescued) statsElements[0].setAttribute('data-target', data.petsRescued);
      if (data.successfulAdoptions) statsElements[1].setAttribute('data-target', data.successfulAdoptions);
      if (data.currentRescues) statsElements[2].setAttribute('data-target', data.currentRescues);
      if (data.partnerShelters) statsElements[3].setAttribute('data-target', data.partnerShelters);
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Keep the default statistics if API fails
  }
}

// Animate Statistics
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateStat = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current);
        requestAnimationFrame(updateStat);
      } else {
        stat.textContent = target;
      }
    };

    updateStat();
  });
}

// Start animation when stats section is in view
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      observer.unobserve(entry.target);
    }
  });
});

var predefinedAddress = "Guru Nanak College of Arts, Science and Commerce (Autonomous), R Jaimal Singh Marg, G.T.B. Nagar, Sion East, Antop Hill, Mumbai, Maharashtra 400037";

document.getElementById("getLocationBtn").addEventListener("click", function() {
    // Show "Searching location..." message
    document.getElementById("location").value = "Searching location...";

    // Simulate a 3-second delay before showing the address
    setTimeout(function() {
        document.getElementById("location").value = predefinedAddress;
    }, 3000);
});

// Store selected files
let selectedFiles = [];

// Function to add files to the selection
function addFiles(newFiles) {
    for (let i = 0; i < newFiles.length; i++) {
        selectedFiles.push(newFiles[i]);
    }
    updateImagePreview();
}

// Function to remove a file from the selection
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateImagePreview();
}

// Function to update the image preview
function updateImagePreview() {
    const previewContainer = document.getElementById('image-preview');
    previewContainer.innerHTML = ''; // Clear previous previews
    
    if (selectedFiles.length === 0) {
        previewContainer.innerHTML = '<p>No images selected</p>';
        return;
    }
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        reader.onload = function(e) {
            // Create image preview
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            
            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = function() {
                removeFile(i);
            };
            
            // Add elements to preview item
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    }
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        addFiles(files);
    }
    // Reset the input to allow selecting the same file again
    event.target.value = '';
}

// Initialize file input event listener
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('images');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Initialize empty preview
    updateImagePreview();
});

// Function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Handle Report Form Submission
const rescueForm = document.getElementById('rescueForm');
rescueForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    // Show loading state
    const submitButton = rescueForm.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Generate a unique report ID
    const reportId = 'R' + Date.now().toString().slice(-8);
    
    // Get form data
    const location = document.getElementById('location').value;
    const petType = document.getElementById('petType').value;
    const description = document.getElementById('description').value;
    const contact = document.getElementById('contact').value;
    
    // Convert images to base64 strings
    const imagePromises = Array.from(selectedFiles).map(file => fileToBase64(file));
    const images = await Promise.all(imagePromises);
    
    // Create the payload
    const payload = {
      reportId,
      location,
      rescueType: petType,
      description,
      contact,
      images
    };
    
    // Send data to the server
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit rescue report');
    }
    
    const data = await response.json();
    
    // Show success message
    alert(`Thank you for reporting. Our rescue team will respond within 30 minutes. Your report ID is ${reportId}.`);
    
    // Reset form and selected files
    rescueForm.reset();
    selectedFiles = [];
    updateImagePreview();
  } catch (error) {
    console.error('Error submitting rescue report:', error);
    alert('There was an error submitting your report. Please try again later.');
  } finally {
    // Reset button state
    const submitButton = rescueForm.querySelector('.submit-button');
    submitButton.textContent = 'Submit Report';
    submitButton.disabled = false;
  }
});

// Function to fetch active rescue reports
async function fetchActiveRescues() {
  try {
    const response = await fetch(`${API_URL}?status=active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active rescues');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching active rescues:', error);
    return [];
  }
}

// Smooth Scroll to Sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
}

// Update rescue status
async function updateRescueStatus(reportId, status) {
  try {
    const response = await fetch(`${API_URL}/${reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update rescue status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating rescue status:', error);
    throw error;
  }
}

// Delete rescue report
async function deleteRescueReport(reportId) {
  try {
    const response = await fetch(`${API_URL}/${reportId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete rescue report');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting rescue report:', error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const emergencyElement = document.querySelector("li"); // Select the <li> element
  if (emergencyElement) {
      emergencyElement.innerHTML = "Emergency: +91 98765 43210"; // Update with a valid 10-digit number
  }
});

// Newsletter Form
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  if (email) {
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
  }
});

// Check connection status
function checkApiConnection() {
  return fetch(`${API_URL}/health`)
    .then(response => response.ok)
    .catch(() => false);
}

// Initialize the application
async function initApp() {
  // Check if API is available
  const isConnected = await checkApiConnection();
  
  if (isConnected) {
    console.log('✅ Connected to backend API');
    // Fetch data from API
    fetchSuccessStories();
    fetchStatistics();
  } else {
    console.log('⚠️ Using local data (backend API not available)');
    // Continue with local data
  }
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}