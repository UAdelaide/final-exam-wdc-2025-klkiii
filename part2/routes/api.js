const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/dogs',async (req,res)=>{
    try{
        const ownerId = req.session
    }
})