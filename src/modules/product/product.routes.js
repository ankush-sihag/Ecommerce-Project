const express = require('express');

const router = express.Router();

const {
    createProduct,
} = require('./product.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorize = require('../../middlewares/role.middleware');

router.post('/', authMiddleware, authorize('admin'), createProduct);

module.exports = router;