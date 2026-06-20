const asyncHandler = require('../../utils/asyncHandler');

const { 
    createCategory: createCategoryService,
    getAllCategories: getAllCategoriesService,
    getCategoryById: getCategoryByIdService,
    updateCategory: updateCategoryService,
    deleteCategory: deleteCategoryService,
 } = require('./category.service');

const createCategory = asyncHandler(async (req, res) => {
    const category = await createCategoryService(req.body);
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
    });
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await getAllCategoriesService();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await getCategoryByIdService(req.params.id);
    res.status(200).json({
        success: true,
        data: category,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await updateCategoryService(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
    });
});

const deleteCategory = asyncHandler(async(req, res) => {
    const category = await deleteCategoryService(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
    });
});

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };