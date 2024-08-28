const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const hbs = require('hbs');
const authMiddleware = require('./middleware/authMiddleware'); // Custom authentication middleware
require('dotenv').config();

const app = express();
const DB='mongodb+srv://rajvardhanchaudhary666:Xq2k7HKxHMyr3qK2@cluster0.aywxj.mongodb.net/user-registration-app'

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/user-registration-app')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Failed to connect to MongoDB', err));
mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes); // Protect this route with authMiddleware

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Views routes
app.get('/', (req, res) => res.render('register')); // Registration page
app.get('/login', (req, res) => res.render('login')); // Login page
app.get('/home',  (req, res) => res.render('home')); // Home page, protected

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});