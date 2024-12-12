require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const nurseRoutes = require('./routes/nurseRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();

connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/patient', patientRoutes);

// Listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
