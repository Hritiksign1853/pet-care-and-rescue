// Pet Data
const pets = [
    {
      id: 1,
      name: "Buddy",
      type: "dog",
      breed: "Golden Retriever",
      age: "2 years",
      size: "large",
      description: "Friendly and energetic Golden Retriever looking for an active family",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500",
      gender: "Male",
      vaccinated: true,
      neutered: true
    },
    {
      id: 2,
      name: "Luna",
      type: "cat",
      breed: "Siamese",
      age: "1 year",
      size: "small",
      description: "Gentle and affectionate Siamese cat who loves attention",
      imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=500",
      gender: "Female",
      vaccinated: true,
      neutered: true
    },
    {
      id: 3,
      name: "Max",
      type: "dog",
      breed: "German Shepherd",
      age: "6 months",
      size: "medium",
      description: "Playful German Shepherd puppy with lots of energy",
      imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=500",
      gender: "Male",
      vaccinated: true,
      neutered: false
    },
    {
      id: 4,
      name: "Bella",
      type: "cat",
      breed: "Persian",
      age: "4 years",
      size: "small",
      description: "Calm and dignified Persian cat seeking a quiet home",
      imageUrl: "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?auto=format&fit=crop&q=80&w=500",
      gender: "Female",
      vaccinated: true,
      neutered: true
    },
    {
      id: 5,
      name: "Rocky",
      type: "dog",
      breed: "Bulldog",
      age: "3 years",
      size: "medium",
      description: "Friendly Bulldog who loves cuddles and short walks",
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=500",
      gender: "Male",
      vaccinated: true,
      neutered: true
    },
    {
      id: 6,
      name: "Milo",
      type: "other",
      breed: "Rabbit",
      age: "1 year",
      size: "small",
      description: "Gentle rabbit who enjoys being petted and eating carrots",
      imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=500",
      gender: "Male",
      vaccinated: true,
      neutered: true
    }
  ];
  
  // Success Stories Data
  const successStories = [
    {
      id: 1,
      name: "Charlie's New Beginning",
      date: "March 15, 2024",
      description: "After months in the shelter, Charlie found his forever family and now enjoys beach walks every day.",
      imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 2,
      name: "Lily's Happy Tale",
      date: "March 10, 2024",
      description: "Rescued from the streets, Lily now brings joy to her elderly owner's life every day.",
      imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=500"
    },
    {
      id: 3,
      name: "Max's Journey Home",
      date: "March 5, 2024",
      description: "From scared shelter dog to confident family pet, Max's transformation is incredible.",
      imageUrl: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&q=80&w=500"
    }
  ];
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    displayPets(pets);
    displaySuccessStories();
    setupFilters();
  });
  
  // Display Pets
  function displayPets(petsToShow) {
    const petsGrid = document.getElementById('petsGrid');
    petsGrid.innerHTML = '';
  
    petsToShow.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      petCard.innerHTML = `
        <img src="${pet.imageUrl}" alt="${pet.name}">
        <div class="pet-info">
          <h3>${pet.name}</h3>
          <div class="pet-details">
            <span>Type: ${pet.type}</span>
            <span>Age: ${pet.age}</span>
            <span>Size: ${pet.size}</span>
            <span>Gender: ${pet.gender}</span>
          </div>
          <p>${pet.description}</p>
          <button onclick="adoptPet(${pet.id})" class="adopt-button">Adopt Me</button>
        </div>
      `;
      petsGrid.appendChild(petCard);
    });
  }
  
  // Display Success Stories
  function displaySuccessStories() {
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
  }
  
  // Setup Filters
  function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const ageFilter = document.getElementById('ageFilter');
    const sizeFilter = document.getElementById('sizeFilter');
  
    // Add event listeners
    searchInput.addEventListener('input', filterPets);
    typeFilter.addEventListener('change', filterPets);
    ageFilter.addEventListener('change', filterPets);
    sizeFilter.addEventListener('change', filterPets);
  }
  
  // Filter Pets
  function filterPets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;
    const sizeFilter = document.getElementById('sizeFilter').value;
  
    const filteredPets = pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchTerm) ||
                           pet.description.toLowerCase().includes(searchTerm);
      const matchesType = !typeFilter || pet.type === typeFilter;
      const matchesSize = !sizeFilter || pet.size === sizeFilter;
      
      // Age filter logic (simplified for demo)
      const matchesAge = !ageFilter || (
        (ageFilter === 'baby' && pet.age.includes('months')) ||
        (ageFilter === 'young' && pet.age.includes('1 year')) ||
        (ageFilter === 'adult' && (parseInt(pet.age) >= 2 && parseInt(pet.age) <= 8)) ||
        (ageFilter === 'senior' && parseInt(pet.age) > 8)
      );
  
      return matchesSearch && matchesType && matchesSize && matchesAge;
    });
  
    displayPets(filteredPets);
  }
  
  // Adopt Pet
  function adoptPet(id) {
    const pet = pets.find(p => p.id === id);
    if (pet) {
      // In a real application, this would open an adoption form or modal
      alert(`Thank you for your interest in adopting ${pet.name}! Please fill out our adoption application form.`);
      window.location.href = 'contact.html';
    }
  }
  
  // Newsletter Form
  document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    if (email) {
      alert('Thank you for subscribing to our newsletter!');
      e.target.reset();
    }
  });