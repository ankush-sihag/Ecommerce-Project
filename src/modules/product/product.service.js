const mongoose = require('mongoose');

const ApiError = require('../../utils/ApiError');

const slugify = require('../../utils/slugify');

const {
    createProduct: createProductRepository,
    findProductBySlug,
    findProductBySku,
} = require('./product.repository');

const { findCategoryById } = require('../category/category.repository');

const createProduct = async(productData) => {
    const { name, category, variants } = productData;
    if(!mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError( 400, 'Invalid category id');
    }

    const existingCategory = await findCategoryById(category);
    if (!existingCategory || !existingCategory.isActive) {
        throw new ApiError(404, 'Category not found');
    }

    if (!variants || variants.length ===0) {
        throw new ApiError( 400, 'At least one variant is required');
    }

    const skuSet = new Set();
    for (const vatiant of variants) {
        if (skuSet.has(variants.sku)) {
            throw new ApiError( 400, 'Duplicate SKU in request');
        }
        skuSet.add(variants.sku);
    }

    const slug = slugify(name);
    const existingProduct = await findProductBySlug(slug);
    if (existingProduct) {
        throw new ApiError( 409, 'Product already exists');
    }

    for (const variant of variants) {
        const existingSku = await findProductBySku(variant.sku);
        if (existingSku) {
            throw new ApiError( 409, `SKU ${variant.sku} already exists`);
        }
    }

    const product = await createProductRepository({
        ...productData,
        slug,
    });
    return product;
};

module.exports = { createProduct };