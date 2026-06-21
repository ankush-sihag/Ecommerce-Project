const asyncHandler = require('../../utils/asyncHandler');

const {
    createProduct: createProductService,
} = require('./product.service');

const createProduct = asyncHandler(async (req, res) => {
    const product = await createProductService(req.body);
    res.status(201).json({
        success: true,
        message: "Product created succcessfully",
        data: product,
    });
});

module.exports =  { createProduct };