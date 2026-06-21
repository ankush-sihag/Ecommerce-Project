const express = require('express');

const router = express.Router();

const {
    createProduct,
    getAllProducts,
} = require('./product.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorize = require('../../middlewares/role.middleware');
const { getProductById, deleteProduct, updateProduct } = require('./product.service');

router.post('/', authMiddleware, authorize('admin'), createProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.patch('/:id', authMiddleware, authorize('admin'), updateProduct);

router.delete('/:id', authMiddleware, authorize('admin'), deleteProduct);

module.exports = router;