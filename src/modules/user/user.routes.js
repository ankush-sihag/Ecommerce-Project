const express = require('express');

const { registerUser } = require('./user.controller');

const router = express.Router();

router.post('/register', registerUser);

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "User Route Working"
    });
});

module.exports = router;