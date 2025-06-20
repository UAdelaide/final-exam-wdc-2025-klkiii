const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/summary', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
          u.username AS walker_username,
          COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks,
          ROUND(AVG(r.rating), 2) AS average_rating
        FROM Users u
        LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
        LEFT JOIN WalkRequests wr ON r.request_id = wr.request_id
        WHERE u.role = 'walker'
        GROUP BY u.user_id
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
  });

  return router;
};