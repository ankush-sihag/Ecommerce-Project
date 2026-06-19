const express = require('express');

const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const authorize = require('../../middlewares/role.middleware');

const { createCategory } = require('./category.controller');

router.post('/', authMiddleware, authorize('admin'), createCategory);

module.exports = router;