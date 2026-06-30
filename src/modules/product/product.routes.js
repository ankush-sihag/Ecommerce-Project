const express = require('express');

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('./product.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const authorize = require('../../middlewares/role.middleware');


router.post('/', authMiddleware, authorize('admin'), createProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.patch('/:id', authMiddleware, authorize('admin'), updateProduct);

router.delete('/:id', authMiddleware, authorize('admin'), deleteProduct);

module.exports = router;