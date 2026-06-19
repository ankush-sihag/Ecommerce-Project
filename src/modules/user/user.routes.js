const express = require('express');

const { registerUser, loginUser, getProfile, changePassword, forgotPassword, resetPassword } = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
// const { resetPassword } = require('./user.service');


const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getProfile);

router.post('/change-password', authMiddleware, changePassword);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

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