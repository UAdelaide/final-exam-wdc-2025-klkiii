const exoress = require('express');
const router = express.router();
const db = require('../models/db.js');

router.post('/login',async(req,res)=>{
    const { username , password } = req.body;

    try{
        const user = await db.query(
            'SELECT * FROM users Where username = ? AND password = ?',
            [username, password]
        )
    }

})