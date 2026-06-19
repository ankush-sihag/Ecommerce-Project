const asyncHandler = require('../../utils/asyncHandler');

const { createCategory: createCategoryService } = require('./category.service');

const createCategory = asyncHandler(async (req, res) => {
    const category = await createCategoryService(req.body);
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
    });
});

module.exports = { createCategory };