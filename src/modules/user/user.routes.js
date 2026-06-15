const express = require('express');

const { registerUser } = require('./user.controller');
const { loginUser } = require('./user.service');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "User Route Working"
    });
});

module.exports = router;