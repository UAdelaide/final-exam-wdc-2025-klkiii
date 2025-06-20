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
        console.error(err);{
            res.status(500).send('Server error loading Dogs');
        }
    }
});

router.get('/', async (req, res) => {
   try {
    const [rows] = await db.query(`
      SELECT d.dog_id, d.name AS dog_name, d.size, d.owner_id, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
     res.json(rows);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Failed to fetch dogs' });
   }
 });

module.exports = router;