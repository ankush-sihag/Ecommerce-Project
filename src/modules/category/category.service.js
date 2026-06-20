const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');
const slugify = require('../../utils/slugify');

const {
    createCategory: createCategoryRepository,
    findCategoryBySlug,
    findAllCategories,
    findCategoryById,
    updateCategoryById,
} = require('./category.repository');

const createCategory = async (categoryData) => {
    const slug = slugify(categoryData.name);
    const existingCategory = await findCategoryBySlug(slug);
    if (existingCategory) {
        throw new ApiError(409, 'Category already exists');
    }

    const category = await createCategoryRepository({ ...categoryData, slug });
    return category;
};

const getAllCategories = async () => {
    const categories = await findAllCategories({ isActive: true });
    return categories;
};

const getCategoryById = async (categoryId) =>{
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, 'Invalid category id');
    }

    const category = await findCategoryById(categoryId);
    if (!category || !category.isActive) {
        throw new ApiError(404, 'Category not found');
    }
    return category;
};

const updateCategory = async (categoryId, updateData) =>{
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, 'Invalid category id');
    }

    const category = await findCategoryById(categoryId);
    if (!category || !category.isActive) {
        throw new ApiError(404, 'Category not found');
    }

    if (updateData.name) {
        const slug = slugify(updateData.name);
        const existingCategory = await findCategoryBySlug(slug);
        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            throw new ApiError(409, 'Category already exists');
        }
        updateData.slug = slug;
    }
    return updateCategoryById(categoryId, updateData);
};

const deleteCategory = async (categoryId) => {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, 'Invalid category id');
    }
    const category = await findCategoryById(categoryId);
    if (!category || !category.isActive) {
        throw new ApiError(404, 'Category not found');
    }
    category.isActive = false;
    await category.save();
    return;
};

module.exports = {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };