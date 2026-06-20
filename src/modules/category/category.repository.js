const Category = require('./category.model');

const createCategory = async (categoryData) => {
    return Category.create(categoryData);
};

const findCategoryBySlug = async (slug) => {
    return Category.findOne({ slug });
};

const findAllCategories = async ( filter = {} ) => {
    return Category.find(filter);
};

const findCategoryById = async (id) => {
    return Category.findById(id);
};

const updateCategoryById = async (categoryId, updateData) => {
    return Category.findByIdAndUpdate(
        categoryId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};

module.exports = { createCategory, findCategoryBySlug, findAllCategories, findCategoryById, updateCategoryById };