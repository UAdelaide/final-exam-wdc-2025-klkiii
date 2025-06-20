var express = require('express');
const mysql = require('mysql2/promise');
const dogsRoute = require('./routes/dogs');
const walkRequestsRoute = require('./routes/walkrequests');
const walkersRoute = require('./routes/walkers');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
let db;
async function main() {
  // Step 1: Create the database if it doesn't exist
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });
  await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
  await connection.end();

  // Step 2: Connect to the DogWalkService database
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
  });

  // Step 3: Create tables and insert seed data
  await db.query(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('owner', 'walker') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS Dogs (
      dog_id INT AUTO_INCREMENT PRIMARY KEY,
      owner_id INT NOT NULL,
      name VARCHAR(50) NOT NULL,
      size ENUM('small', 'medium', 'large') NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES Users(user_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS WalkRequests (
      request_id INT AUTO_INCREMENT PRIMARY KEY,
      dog_id INT NOT NULL,
      requested_time DATETIME NOT NULL,
      duration_minutes INT NOT NULL,
      location VARCHAR(255) NOT NULL,
      status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS WalkRatings (
      rating_id INT AUTO_INCREMENT PRIMARY KEY,
      request_id INT NOT NULL,
      walker_id INT NOT NULL,
      owner_id INT NOT NULL,
      rating INT CHECK (rating BETWEEN 1 AND 5),
      comments TEXT,
      rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
      FOREIGN KEY (walker_id) REFERENCES Users(user_id),
      FOREIGN KEY (owner_id) REFERENCES Users(user_id),
      UNIQUE (request_id)
    )
  `);

  // Insert sample data if Users table is empty
  const [users] = await db.query('SELECT COUNT(*) as count FROM Users');
  if (users[0].count === 0) {
    // Insert Users
    await db.query(`
      INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('jhonywalker', 'jhony@example.com', 'hashed6969', 'walker'),
        ('eve', 'eve@example.com', 'hashed999', 'owner')
    `);

    // Insert Dogs
    await db.query(`
      INSERT INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Rocky', 'large'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Daisy', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'eve'), 'Charlie', 'small')
    `);

    // Insert Walk Requests
    await db.query(`
      INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-11 07:00:00', 60, 'River Walk', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Daisy'), '2025-06-11 10:15:00', 40, 'Central Park', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-06-12 11:00:00', 20, 'Sunny Street', 'cancelled')
    `);
  }

  // Middleware and Routes
  app.use('/api/dogs', dogsRoute(db));
  app.use('/api/walkrequests', walkRequestsRoute(db));
  app.use('/api/walkers', walkersRoute(db));

  // Start server
  app.listen(3000, () => console.log('Server running on port 3000'));
}

main().catch(console.error);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
