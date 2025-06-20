
const express = require('express');

module.exports = (db) => {
 const router = express.Router();



 router.get('/', async (req, res) => {
   try {
     const [rows] = await db.query(`
