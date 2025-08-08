// Carousel Data
const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1200",
      caption: "Pawsitively the Best Care for Your Furry Friends"
    },
    {
      url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200",
      caption: "Professional Pet Care Services"
    },
    {
      url: "dog-4494554_1280.jpg",
      caption: "Best Pet Care Services"
    }
  ];
  
  // Pet Data

  
  // Initialize Carousel
  let currentSlide = 0;
  const carouselInner = document.querySelector('.carousel-inner');
  
  // Create carousel slides
  carouselImages.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `
      <img src="${image.url}" alt="Slide ${index + 1}">
      <div class="carousel-caption">
        <h1>${image.caption}</h1>
      </div>
    `;
    carouselInner.appendChild(slide);
  });
  
  // Carousel Controls
  function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }
  
  document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });
  
  document.querySelector('.carousel-btn.next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });
  
  // Auto advance carousel
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
  
  // Initialize Pet Cards
  const petsGrid = document.querySelector('.pets-grid');
  
  pets.forEach(pet => {
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    petCard.innerHTML = `
      <img src="${pet.imageUrl}" alt="${pet.name}">
      <div class="pet-card-content">
        <h3>${pet.name}</h3>
        <p>${pet.description}</p>
        <button onclick="viewPetDetails(${pet.id})">Learn More</button>
      </div>
    `;
    petsGrid.appendChild(petCard);
  });
  
  // View Pet Details
  function viewPetDetails(id) {
    window.location.href=`pet-details.html?id=${id}`;
  }
  
  // Newsletter Form
  document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    if (email) {
      alert('Thank you for Your Feedback!');
      e.target.reset();
    }
  });