const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

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

        console.log(users[0].role);

        //redirect based on role
        if (users[0].role === 'owner'){
            return res.redirect('/owner-dashboard.html');
        }
        if (users[0].role === 'walker'){
            return res.redirect('/walker-dashboard.html');
        }
        return res.status(403).send('Unknown role');



    } catch(err){
        console.error(err);
        return res.status(500).send('Internal server error');
    }

});

module.exports = router;
