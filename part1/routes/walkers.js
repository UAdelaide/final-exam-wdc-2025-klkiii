const express = require('express');

module.exports = (db) => {
 const router = express.Router();



 router.get('/summary', async (req, res) => {
   try {