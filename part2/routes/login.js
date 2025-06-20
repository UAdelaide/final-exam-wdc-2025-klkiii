const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.post('/login',async(req,res)=>{
    const { username , password } = req.body;

    try{
        //lookup user
        const user = await db.query(
            'SELECT * FROM users Where username = ? AND password = ?',
            [username, password]
        );
        if (user.length === 0){
            return res.status(401).send('Invalid credentials');
        }

        //save session
        req.session.user = {
            id: user[0].user_id,
            username: user[0].username,
            role: user[0].role
        };

        //redirect based on role
        if (user[0].role === 'owner'){
            return res.redirect('/owner-dashboard.html');
        }
        if (user[0].role === 'walker'){
            return res.redirect('/walker-dashboard.html');
        }
        return res.status(403).send('Unknown role');



    } catch(err){
        console.error(err);
        return res.status(500).send('Internal server error');
    }

});

module.exports = router;
