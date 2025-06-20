const express = require('express');

router.get('/open', async (req, res) => {
   try {
     const [rows] = await db.query(`
       SELECT wr.requested_time, wr.location, d.name AS dog_name, u.username AS owner_username
       FROM WalkRequests wr
       JOIN Dogs d ON wr.dog_id = d.dog_id
       JOIN Users u ON d.owner_id = u.user_id
       WHERE wr.status = 'open'
     `);


