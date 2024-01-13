const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes.js');
const postRoutes = require('./Routes/postRoutes.js');

const app = express();
const PORT = 3000;
const URI = 'mongodb+srv://akashkajale125:akash12@usersinfo.o8le98w.mongodb.net/userInfo?retryWrites=true&w=majority';

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }
};

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', postRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
