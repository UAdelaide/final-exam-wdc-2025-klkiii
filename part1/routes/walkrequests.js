const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/open', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT wr.requested_time, wr.location, d.name AS dog_name, u.username AS owner_username
        FROM WalkRequests wr
        JOIN Dogs d ON wr.dog_id = d.dog_id
        JOIN Users u ON d.owner_id = u.user_id
        WHERE wr.status = 'open'
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
  });

  return router;
};
