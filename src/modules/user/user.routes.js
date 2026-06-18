const express = require('express');

const { registerUser, loginUser, getProfile } = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getProfile);

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "User Route Working"
    });
});

router.get(
    '/admin-test',
    authMiddleware,
    roleMiddleware('ADMIN'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Welcome admin',
        });
    }
);

module.exports = router;