const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/dogs',async (req,res)=>{
    try{
        const ownerId = req.session.user?.id;
        if (!ownerId) return res.status(401).send('Not logged in');

        const[dogs] = await db.query('SELECT dog_id,name,size FROM Dogs WHERE owner_id = ?',[ownerId]);
        res.json(dogs);
    }catch(err){
        console
    }
})