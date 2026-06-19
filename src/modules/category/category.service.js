const ApiError = require('../../utils/ApiError');

const slugify = require('../../utils/slugify');

const {
    createCategory: createCategoryRepository,
    findCategoryBySlug,
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

module.exports = {createCategory};