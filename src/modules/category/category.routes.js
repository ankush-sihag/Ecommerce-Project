const express = require('express');

const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const authorize = require('../../middlewares/role.middleware');

const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('./category.controller');

router.post('/', authMiddleware, authorize('admin'), createCategory);

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.patch('/:id', authMiddleware, authorize('admin'), updateCategory);

router.delete('/:id', authMiddleware, authorize('admin'), deleteCategory);

module.exports = router;