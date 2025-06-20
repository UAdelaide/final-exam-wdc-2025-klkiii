const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

const app = express();
//auth middleware
const {ensureLoggedIn, ensureRole} = require('./middleware/auth.js')
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));



//session
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'pancakes@69',
    resave: false,
    saveUninitialized: false
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/login');
const logoutRoute = require('./routes/logout');
const dogRoute = require('./routes/dogs');



app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/',loginRoutes);
//app.use('/',logoutRoute);
app.use('/',dogRoute);
app.use('/api/dogs', require('./routes/dogs'));

//get for the dashboard
app.get('/owner-dashboard', ensureLoggedIn, ensureRole('owner'), (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'owner-dashboard.html'));
});

app.get('/walker-dashboard', ensureLoggedIn, ensureRole('walker'), (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'walker-dashboard.html'));
});

// Export the app instead of listening here
module.exports = app;