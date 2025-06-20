const exoress = require('express');
const router = express.router();
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
        if ()


    }

})