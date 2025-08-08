// Admin Dashboard JavaScript
'use strict';

// API Base URL
const API_BASE_URL = 'http://localhost:5500/api/admin';

/**
 * API Service for backend communication
 */
const ApiService = {
    /**
     * Make a GET request to the API
     * @param {string} endpoint - API endpoint
     * @returns {Promise<any>} - Promise with response data
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API GET error for ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Make a POST request to the API
     * @param {string} endpoint - API endpoint
     * @param {object} data - Data to send
     * @returns {Promise<any>} - Promise with response data
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API POST error for ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Make a PUT request to the API
     * @param {string} endpoint - API endpoint
     * @param {object} data - Data to send
     * @returns {Promise<any>} - Promise with response data
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API PUT error for ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Make a DELETE request to the API
     * @param {string} endpoint - API endpoint
     * @returns {Promise<any>} - Promise with response data
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API DELETE error for ${endpoint}:`, error);
            throw error;
        }
    }
};

/**
 * Error handling utility
 */
const ErrorHandler = {
    errors: {
        NETWORK: 'Network error occurred',
        AUTH: 'Authentication error',
        VALIDATION: 'Validation error',
        NOT_FOUND: 'Resource not found',
        UNKNOWN: 'An unknown error occurred'
    },

    /**
     * Show error toast notification
     * @param {string} message - Error message to display
     * @param {number} duration - Duration in milliseconds
     */
    showError(message, duration = 3000) {
        this.showToast('errorToast', message, duration);
    },

    /**
     * Show success toast notification
     * @param {string} message - Success message to display
     * @param {number} duration - Duration in milliseconds
     */
    showSuccess(message, duration = 3000) {
        this.showToast('successToast', message, duration);
    },

    /**
     * Generic toast display function
     * @param {string} toastId - ID of the toast element
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    showToast(toastId, message, duration) {
        const toast = document.getElementById(toastId);
        if (!toast) return;
        
        toast.textContent = message;
        toast.style.display = 'block';

        // Clear any existing timeout
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
        }

        // Set new timeout
        toast.timeoutId = setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }
};

/**
 * Status configurations for different entity types
 */
const STATUS_CONFIG = {
    appointment: {
        options: ['pending', 'confirmed', 'completed', 'cancelled'],
        labels: {
            pending: 'Pending',
            confirmed: 'Confirmed',
            completed: 'Completed',
            cancelled: 'Cancelled'
        }
    },
    rescue: {
        options: ['active', 'completed', 'cancelled'],
        labels: {
            active: 'Active',
            completed: 'Completed',
            cancelled: 'Cancelled'
        }
    },
    donation: {
        options: ['pending', 'completed', 'failed'],
        labels: {
            pending: 'Pending',
            completed: 'Completed',
            failed: 'Failed'
        }
    }
};

/**
 * Data store for the dashboard
 */
const DataStore = {
    dashboardStats: {
        appointments: 0,
        rescues: 0,
        donations: 0,
        contacts: 0
    },
    appointments: [],
    rescues: [],
    donations: [],
    contacts: []
};

/**
 * Initialize the dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

/**
 * Main initialization function
 */
async function initializeDashboard() {
    try {
        setupNavigation();
        setupClock();
        setupModals();
        await fetchAllData();
        updateDashboardUI();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        ErrorHandler.showError(ErrorHandler.errors.UNKNOWN);
    }
}

/**
 * Fetch all data from the API
 */
async function fetchAllData() {
    try {
        // Show loading state
        document.querySelectorAll('.stat-number').forEach(el => {
            el.innerHTML = '<span class="loading">Loading...</span>';
        });
        
        // Fetch dashboard stats
        const dashboardData = await ApiService.get('dashboard');
        DataStore.dashboardStats = dashboardData;
        
        // Fetch all data in parallel
        const [appointments, rescues, donations, contacts] = await Promise.all([
            ApiService.get('appointments'),
            ApiService.get('rescue'),
            ApiService.get('donations'),
            ApiService.get('contacts')
        ]);
        
        DataStore.appointments = appointments;
        DataStore.rescues = rescues;
        DataStore.donations = donations;
        DataStore.contacts = contacts;
        
        // Update UI with fetched data
        loadDashboardData();
        
    } catch (error) {
        console.error('Error fetching data:', error);
        ErrorHandler.showError('Failed to load data from server. Please try again later.');
    }
}

/**
 * Update dashboard UI with stats
 */
function updateDashboardUI() {
    // Update dashboard stats
    const stats = document.querySelectorAll('.stat-card .stat-number');
    if (stats.length >= 4) {
        stats[0].textContent = DataStore.dashboardStats.appointments || 0;
        stats[1].textContent = DataStore.dashboardStats.rescues || 0;
        stats[2].textContent = `₹${DataStore.dashboardStats.donations || 0}`;
        stats[3].textContent = DataStore.dashboardStats.contacts || 0;
    }
}

/**
 * Setup navigation and sidebar functionality
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active navigation item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            const sectionId = item.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                }
            });
        });
    });

    // Handle sidebar toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

/**
 * Setup clock display with auto-update
 */
function setupClock() {
    const updateClock = () => {
        const clockDisplay = document.getElementById('clockDisplay');
        if (clockDisplay) {
            const now = new Date();
            clockDisplay.textContent = now.toLocaleTimeString();
        }
    };

    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Setup modal dialogs
 */
function setupModals() {
    setupDetailModal();
    setupEditStatusModal();
}

/**
 * Setup detail modal for viewing data
 */
function setupDetailModal() {
    const modalHTML = `
        <div id="detailModal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div id="modalContent"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Close modal when clicking on X or outside the modal
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('detailModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

/**
 * Setup edit status modal
 */
function setupEditStatusModal() {
    const modalHTML = `
        <div id="editStatusModal" class="modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeEditModal()">&times;</span>
                <h2>Edit Status</h2>
                <div id="editStatusContent">
                    <div class="form-group">
                        <label for="statusSelect">Status:</label>
                        <select id="statusSelect"></select>
                    </div>
                    <div class="form-actions">
                        <button id="saveStatusBtn" class="btn btn-primary">Save</button>
                        <button onclick="closeEditModal()" class="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Create HTML for status display
 * @param {string} type - Entity type (appointment, rescue, donation)
 * @param {string} currentStatus - Current status value
 * @returns {string} HTML for status display
 */
function createStatusDisplay(type, currentStatus) {
    const config = STATUS_CONFIG[type.toLowerCase()];
    if (!config) return '';
    
    return `
        <div class="status-display status-${currentStatus}">
            <span class="status-dot status-${currentStatus}"></span>
            ${config.labels[currentStatus]}
        </div>
    `;
}

/**
 * Create HTML for action buttons
 * @param {string} type - Entity type (Appointment, Rescue, Donation, Contact)
 * @param {string} id - Entity identifier
 * @returns {string} HTML for action buttons
 */
function createActionButtons(type, id) {
    return `
        <div class="action-buttons">
            <button class="btn btn-view" onclick="view${type}('${id}')">View</button>
            <button class="btn btn-edit" onclick="edit${type}('${id}')">Edit</button>
            <button class="btn btn-delete" onclick="delete${type}('${id}')">Delete</button>
        </div>
    `;
}

/**
 * Load data into dashboard tables
 */
function loadDashboardData() {
    loadAppointmentsTable();
    loadRescuesTable();
    loadDonationsTable();
    loadContactsTable();
}

/**
 * Load appointments table data
 */
function loadAppointmentsTable() {
    const appointmentsTable = document.getElementById('appointmentsTableBody');
    if (!appointmentsTable) return;
    
    if (DataStore.appointments.length === 0) {
        appointmentsTable.innerHTML = '<tr><td colspan="7" class="no-data">No appointments found</td></tr>';
        return;
    }
    
    appointmentsTable.innerHTML = DataStore.appointments.map(appointment => {
        // Format date for display
        const date = new Date(appointment.date).toLocaleDateString();
        
        return `
            <tr>
                <td>${date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.name}</td>
                <td>${appointment.service}</td>
                <td>${appointment.phone}</td>
                <td>${appointment. message || ''}</td>
                <td>${createStatusDisplay('appointment', appointment.status)}</td>
                <td>${createActionButtons('Appointment', appointment._id)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Load rescues table data
 */
function loadRescuesTable() {
    const rescueTable = document.getElementById('rescueTableBody');
    if (!rescueTable) return;
    
    if (DataStore.rescues.length === 0) {
        rescueTable.innerHTML = '<tr><td colspan="7" class="no-data">No rescue operations found</td></tr>';
        return;
    }
    
    rescueTable.innerHTML = DataStore.rescues.map(rescue => {
        // Format date for display
        const date = new Date(rescue.date).toLocaleDateString();
        
        return `
            <tr>
                <td>${rescue.reportId}</td>
                <td>${rescue.location}</td>
                <td>${date}</td>
                <td>${rescue.rescueType}</td>
                <td>${rescue.description}</td>
                <td>${createStatusDisplay('rescue', rescue.status)}</td>
                <td>${createActionButtons('Rescue', rescue._id)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Load donations table data
 */
function loadDonationsTable() {
    const donationsTable = document.getElementById('donationsTableBody');
    if (!donationsTable) return;
    
    if (DataStore.donations.length === 0) {
        donationsTable.innerHTML = '<tr><td colspan="7" class="no-data">No donations found</td></tr>';
        return;
    }
    
    donationsTable.innerHTML = DataStore.donations.map(donation => {
        // Format date for display
        const date = new Date(donation.date).toLocaleDateString();
        
        return `
            <tr>
                <td>${date}</td>
                <td>${donation.name}</td>
                <td>₹${donation.amount}</td>
                <td>${donation.email}</td>
                <td>${donation.paymentMethod}</td>
                <td>${createStatusDisplay('donation', donation.status)}</td>
                <td>${createActionButtons('Donation', donation._id)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Load contacts table data
 */
function loadContactsTable() {
    const contactsTable = document.getElementById('contactsTableBody');
    if (!contactsTable) return;
    
    if (DataStore.contacts.length === 0) {
        contactsTable.innerHTML = '<tr><td colspan="7" class="no-data">No contact requests found</td></tr>';
        return;
    }
    
    contactsTable.innerHTML = DataStore.contacts.map(contact => {
        // Format date for display
        const date = new Date(contact.date).toLocaleDateString();
        
        return `
            <tr>
                <td>${date}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.emergency ? '<span class="emergency-badge">Yes</span>' : 'No'}</td>
                <td>${contact.message}</td>
                <td>${createActionButtons('Contact', contact._id)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Open detail modal
 */
function openModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * Close detail modal
 */
function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Open edit status modal
 */
function openEditModal() {
    const modal = document.getElementById('editStatusModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * Close edit status modal
 */
function closeEditModal() {
    const modal = document.getElementById('editStatusModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * View appointment details
 * @param {string} id - Appointment identifier
 */
function viewAppointment(id) {
    const appointment = DataStore.appointments.find(item => item._id === id);
    if (!appointment) {
        ErrorHandler.showError('Appointment not found');
        return;
    }
    
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    
    // Format date for display
    const date = new Date(appointment.date).toLocaleDateString();
    
    modalContent.innerHTML = `
        <div class="detail-card">
            <h2>Appointment Details</h2>
            <div class="detail-item">
                <span class="detail-label">Pet Name:</span>
                <span class="detail-value">${appointment.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${appointment.time}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Mobile Number:</span>
                <span class="detail-value">${appointment.phone}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${appointment. message || 'No notes provided'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value status-${appointment.status}">${STATUS_CONFIG.appointment.labels[appointment.status]}</span>
            </div>
        </div>
    `;
    
    openModal();
}

/**
 * View rescue details
 * @param {string} id - Rescue identifier
 */
function viewRescue(id) {
    const rescue = DataStore.rescues.find(item => item._id === id);
    if (!rescue) {
        ErrorHandler.showError('Rescue operation not found');
        return;
    }
    
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    
    // Format date for display
    const date = new Date(rescue.date).toLocaleDateString();
    
    // Create image gallery HTML
    const imagesHTML = rescue.images && rescue.images.length > 0 
        ? `
            <div class="detail-item">
                <span class="detail-label">Images:</span>
                <div class="detail-value">
                    <div class="rescue-images">
                        ${rescue.images.map(img => `
                            <img src="${img}" alt="Rescue image" class="rescue-image">
                        `).join('')}
                    </div>
                </div>
            </div>
        ` 
        : '';
    
    modalContent.innerHTML = `
        <div class="detail-card">
            <h2>Rescue Operation Details</h2>
            <div class="detail-item">
                <span class="detail-label">Report ID:</span>
                <span class="detail-value">${rescue.reportId}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${rescue.location}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Rescue Type:</span>
                <span class="detail-value">${rescue.rescueType}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${rescue.description}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Contact:</span>
                <span class="detail-value">${rescue.contact}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value status-${rescue.status}">${STATUS_CONFIG.rescue.labels[rescue.status]}</span>
            </div>
            ${imagesHTML}
            
        </div>
    `;
    
    openModal();
}

/**
 * View donation details
 * @param {string} id - Donation identifier
 */
function viewDonation(id) {
    const donation = DataStore.donations.find(item => item._id === id);
    if (!donation) {
        ErrorHandler.showError('Donation record not found');
        return;
    }
    
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    
    // Format date for display
    const date = new Date(donation.date).toLocaleDateString();
    
    modalContent.innerHTML = `
        <div class="detail-card">
            <h2>Donation Details</h2>
            <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${donation.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Amount:</span>
                <span class="detail-value">$${donation.amount}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email ID:</span>
                <span class="detail-value">${donation.email}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${donation.paymentMethod}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value status-${donation.status}">${STATUS_CONFIG.donation.labels[donation.status]}</span>
            </div>
        </div>
    `;
    
    openModal();
}

/**
 * View contact details
 * @param {string} id - Contact identifier
 */
function viewContact(id) {
    const contact = DataStore.contacts.find(item => item._id === id);
    if (!contact) {
        ErrorHandler.showError('Contact request not found');
        return;
    }
    
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    
    // Format date for display
    const date = new Date(contact.date).toLocaleDateString();
    
    modalContent.innerHTML = `
        <div class="detail-card">
            <h2>Contact Request Details</h2>
            <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${contact.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${contact.email}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Mobile:</span>
                <span class="detail-value">${contact.phone}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Emergency:</span>
                <span class="detail-value">${contact.emergency ? 'Yes' : 'No'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Message:</span>
                <span class="detail-value">${contact.message}</span>
            </div>
        </div>
    `;
    
    openModal();
}

/**
 * Edit appointment status
 * @param {string} id - Appointment identifier
 */
async function editAppointment(id) {
    const appointment = DataStore.appointments.find(item => item._id === id);
    if (!appointment) {
        ErrorHandler.showError('Appointment not found');
        return;
    }
    
    const statusSelect = document.getElementById('statusSelect');
    if (!statusSelect) return;
    
    statusSelect.innerHTML = STATUS_CONFIG.appointment.options.map(status => 
        `<option value="${status}" ${status === appointment.status ? 'selected' : ''}>${STATUS_CONFIG.appointment.labels[status]}</option>`
    ).join('');
    
    const saveBtn = document.getElementById('saveStatusBtn');
    if (saveBtn) {
        saveBtn.onclick = async function() {
            try {
                const newStatus = statusSelect.value;
                await updateStatus('appointment', id, newStatus);
                closeEditModal();
            } catch (error) {
                ErrorHandler.showError('Failed to update appointment status');
            }
        };
    }
    
    openEditModal();
}

/**
 * Edit rescue status
 * @param {string} id - Rescue identifier
 */
async function editRescue(id) {
    const rescue = DataStore.rescues.find(item => item._id === id);
    if (!rescue) {
        ErrorHandler.showError('Rescue operation not found');
        return;
    }
    
    const statusSelect = document.getElementById('statusSelect');
    if (!statusSelect) return;
    
    statusSelect.innerHTML = STATUS_CONFIG.rescue.options.map(status => 
        `<option value="${status}" ${status === rescue.status ? 'selected' : ''}>${STATUS_CONFIG.rescue.labels[status]}</option>`
    ).join('');
    
    const saveBtn = document.getElementById('saveStatusBtn');
    if (saveBtn) {
        saveBtn.onclick = async function() {
            try {
                const newStatus = statusSelect.value;
                await updateStatus('rescue', id, newStatus);
                closeEditModal();
            } catch (error) {
                ErrorHandler.showError('Failed to update rescue status');
            }
        };
    }
    
    openEditModal();
}

/**
 * Edit donation status
 * @param {string} id - Donation identifier
 */
async function editDonation(id) {
    const donation = DataStore.donations.find(item => item._id === id);
    if (!donation) {
        ErrorHandler.showError('Donation record not found');
        return;
    }
    
    const statusSelect = document.getElementById('statusSelect');
    if (!statusSelect) return;
    
    statusSelect.innerHTML = STATUS_CONFIG.donation.options.map(status => 
        `<option value="${status}" ${status === donation.status ? 'selected' : ''}>${STATUS_CONFIG.donation.labels[status]}</option>`
    ).join('');
    
    const saveBtn = document.getElementById('saveStatusBtn');
    if (saveBtn) {
        saveBtn.onclick = async function() {
            try {
                const newStatus = statusSelect.value;
                await updateStatus('donation', id, newStatus);
                closeEditModal();
            } catch (error) {
                ErrorHandler.showError('Failed to update donation status');
            }
        };
    }
    
    openEditModal();
}

/**
 * Edit contact (placeholder - contacts don't have status)
 * @param {string} id - Contact identifier
 */
function editContact(id) {
    ErrorHandler.showSuccess('Contact requests do not have a status to edit');
}

/**
 * Update entity status
 * @param {string} type - Entity type (appointment, rescue, donation)
 * @param {string} id - Entity identifier
 * @param {string} newStatus - New status value
 */
async function updateStatus(type, id, newStatus) {
    try {
        let response;
        
        switch(type.toLowerCase()) {
            case 'appointment':
                response = await ApiService.put(`appointment/${id}`, { status: newStatus });
                // Update local data
                DataStore.appointments = DataStore.appointments.map(item =>
                    item._id === id ? { ...item, status: newStatus } : item
                );
                loadAppointmentsTable();
                break;
                
            case 'rescue':
                response = await ApiService.put(`rescue/${id}`, { status: newStatus });
                // Update local data
                DataStore.rescues = DataStore.rescues.map(item =>
                    item._id === id ? { ...item, status: newStatus } : item
                );
                loadRescuesTable();
                break;
                
            case 'donation':
                response = await ApiService.put(`donations/${id}`, { status: newStatus });
                // Update local data
                DataStore.donations = DataStore.donations.map(item =>
                    item._id === id ? { ...item, status: newStatus } : item
                );
                loadDonationsTable();
                break;
        }
        
        ErrorHandler.showSuccess(`${type} status updated successfully`);
        return response;
    } catch (error) {
        console.error(`Status update error:`, error);
        ErrorHandler.showError(`Failed to update ${type} status`);
        throw error;
    }
}

/**
 * Delete appointment
 * @param {string} id - Appointment identifier
 */
async function deleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            await ApiService.delete(`appointment/${id}`);
            
            // Update local data
            DataStore.appointments = DataStore.appointments.filter(item => item._id !== id);
            loadAppointmentsTable();
            
            // Update dashboard stats
            DataStore.dashboardStats.appointments--;
            updateDashboardUI();
            
            ErrorHandler.showSuccess('Appointment deleted successfully');
        } catch (error) {
            console.error('Delete appointment error:', error);
            ErrorHandler.showError('Failed to delete appointment');
        }
    }
}

/**
 * Delete rescue
 * @param {string} id - Rescue identifier
 */
async function deleteRescue(id) {
    if (confirm('Are you sure you want to delete this rescue record?')) {
        try {
            await ApiService.delete(`rescue/${id}`);
            
            // Update local data
            DataStore.rescues = DataStore.rescues.filter(item => item._id !== id);
            loadRescuesTable();
            
            // Update dashboard stats
            DataStore.dashboardStats.rescues--;
            updateDashboardUI();
            
            ErrorHandler.showSuccess('Rescue record deleted successfully');
        } catch (error) {
            console.error('Delete rescue error:', error);
            ErrorHandler.showError('Failed to delete rescue record');
        }
    }
}

/**
 * Delete donation
 * @param {string} id - Donation identifier
 */
async function deleteDonation(id) {
    if (confirm('Are you sure you want to delete this donation record?')) {
        try {
            await ApiService.delete(`donations/${id}`);
            
            // Find the donation to subtract its amount from the total
            const donation = DataStore.donations.find(item => item._id === id);
            
            // Update local data
            DataStore.donations = DataStore.donations.filter(item => item._id !== id);
            loadDonationsTable();
            
            // Update dashboard stats
            if (donation && donation.status === 'completed') {
                DataStore.dashboardStats.donations -= donation.amount;
            }
            updateDashboardUI();
            
            ErrorHandler.showSuccess('Donation record deleted successfully');
        } catch (error) {
            console.error('Delete donation error:', error);
            ErrorHandler.showError('Failed to delete donation record');
        }
    }
}

/**
 * Delete contact
 * @param {string} id - Contact identifier
 */
async function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact request?')) {
        try {
            await ApiService.delete(`contacts/${id}`);
            
            // Update local data
            DataStore.contacts = DataStore.contacts.filter(item => item._id !== id);
            loadContactsTable();
            
            // Update dashboard stats
            DataStore.dashboardStats.contacts--;
            updateDashboardUI();
            
            ErrorHandler.showSuccess('Contact request deleted successfully');
        } catch (error) {
            console.error('Delete contact error:', error);
            ErrorHandler.showError('Failed to delete contact request');
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
     // Handle logout
     logoutBtn.addEventListener('click', function() {
      alert("Logout functionality would go here");
      // In a real application, you would implement actual logout logic here
    });
});  

// Make functions available globally
window.viewAppointment = viewAppointment;
window.viewRescue = viewRescue;
window.viewDonation = viewDonation;
window.viewContact = viewContact;
window.editAppointment = editAppointment;
window.editRescue = editRescue;
window.editDonation = editDonation;
window.editContact = editContact;
window.deleteAppointment = deleteAppointment;
window.deleteRescue = deleteRescue;
window.deleteDonation = deleteDonation;
window.deleteContact = deleteContact;
window.closeModal = closeModal;
window.closeEditModal = closeEditModal;

// Add CSS for loading state
document.head.insertAdjacentHTML('beforeend', `
<style>
.loading {
    display: inline-block;
    position: relative;
    color: #888;
    font-size: 0.875rem;
}

.loading:after {
    content: '...';
    animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60% { content: '...'; }
    80%, 100% { content: ''; }
}

.no-data {
    text-align: center;
    padding: 20px;
    color: #888;
    font-style: italic;
}
</style>
`);