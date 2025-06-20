const express = require('express');

router.get('/open', async (req, res) => {
   try {
     const [rows] = await db.query(`
       SELECT wr.requested_time, wr.location, d.name AS dog_name, u.username AS owner_username

