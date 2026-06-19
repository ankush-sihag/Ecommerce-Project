const Category = require('./category.model');

const createCategory = async (categoryData) => {
    return Category.create(categoryData);
};

const findCategoryBySlug = async (slug) => {
    return Category.findOne({ slug });
};

module.exports = { createCategory, findCategoryBySlug };