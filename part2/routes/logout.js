const express = require('express');
const router = express.Router();

router.get('/logout',(req,res)=>{
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:');
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid');
        res.redirect('index.html');
    });
});

module.export = router;