const express = require('express');
const cors = require('cors');  // Import CORS
const connectDB = require('./config/db'); 
require('dotenv').config();
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require("./routes/contactRoutes");
const signupRoutes = require("./routes/signupRoutes"); 
const donationRoutes = require("./routes/donationRoutes");
const rescueRoutes = require("./routes/rescueRoutes");
const adminRoutes = require("./routes/adminRoutes");



const app = express();

// Connect to MongoDB
connectDB();

// ✅ Enable CORS (Allow frontend to access backend)
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow only your frontend to access
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api', appointmentRoutes);
app.use('/api', contactRoutes);
app.use('/api/auth', signupRoutes);
app.use('/api', donationRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/admin", adminRoutes);
app.get('/', (req, res) => {
    res.send('🐶 Pet Care API is running...');
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
