document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
    // Elements
    const profileImageContainer = document.getElementById('profileImageContainer');
    const profileImage = document.getElementById('profileImage');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    
    
    // Admin data - in a real application, this would come from a database or API
    const adminData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      role: "System Administrator",
      joinDate: "January 15, 2023"
    };
      
      // Initialize admin data
      document.getElementById('adminName').textContent = adminData.name;
      document.getElementByI
    
    // Initialize admin data
    document.getElementById('adminName').textContent = adminData.name;
    document.getElementById('adminEmail').textContent = adminData.email;
    document.getElementById('adminPhone').textContent = adminData.phone;
    document.getElementById('adminLocation').textContent = adminData.location;
    document.getElementById('adminRole').textContent = adminData.role;
    document.getElementById('adminJoinDate').textContent = `Member since: ${adminData.joinDate}`;
    
    // Load saved profile image from localStorage if it exists
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      profileImage.src = savedProfileImage;
    }
    
    // Handle image upload
    function triggerFileInput() {
      fileInput.click();
    }
    
    profileImageContainer.addEventListener('click', triggerFileInput);
    uploadBtn.addEventListener('click', triggerFileInput);
    
    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageDataUrl = e.target.result;
          profileImage.src = imageDataUrl;
          
          // Save the image to localStorage
          localStorage.setItem('profileImage', imageDataUrl);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Handle logout
    logoutBtn.addEventListener('click', function() {
      alert("Logout functionality would go here");
      // In a real application, you would implement actual logout logic here
      
      // Optionally, you could clear the stored image on logout
      // Uncomment the line below if you want to clear the image on logout
      // localStorage.removeItem('profileImage');
    });
  });