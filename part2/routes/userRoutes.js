const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});


//didnt use this pls reffer to login.js file in routes folder
// i realised later that it exists
// POST login (dummy version)
router.post('/login',async(req,res)=>{
    const { username , password } = req.body;

    try{
        //lookup user
        const [users] = await db.query(
            'SELECT * FROM Users Where username = ? AND password_hash = ?',
            [username, password]
        );
        if (users.length === 0){
            return res.status(401).send('Invalid credentials');
        }

        //save session
        req.session.user = {
            id: users[0].user_id,
            username: users[0].username,
            role: users[0].role
        };

        // console.log(users[0].role);

        //redirect based on role
        if (users[0].role === 'owner'){
            return res.redirect('/owner-dashboard');
        }
        if (users[0].role === 'walker'){
            return res.redirect('/walker-dashboard');
        }
        return res.status(403).send('Unknown role');



    } catch(err){
        console.error(err);
        return res.status(500).send('Internal server error');
    }

});

module.exports = router;