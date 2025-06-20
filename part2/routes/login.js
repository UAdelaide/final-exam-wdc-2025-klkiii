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

        req.session.user = {
            id: user[0]
        }

    }

})