const express = require('express');

const { registerUser, loginUser, getProfile, changePassword } = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
// const { changePassword } = require('./user.service');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getProfile);

router.post('/change-password', authMiddleware, changePassword);

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