const mongoose = require('mongoose');

const ApiError = require('../../utils/ApiError');

const slugify = require('../../utils/slugify');

const {
    createProduct: createProductRepository,
    findProductBySlug,
    findProductBySku,
    findAllProducts,
    findProductById,
    updateProductById,
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

const getAllProducts = async () => {
    return findAllProducts();
};

const getProductById = async (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, 'Invalid product id');
    }
    const product = await findProductById(productId);
    if (!product || !product.isActive) {
        throw new ApiError(404, 'Product not found');
    }
    return product;
};

const updateProduct = async (productId, updateData) => {
    if (mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, 'Invalid product id');
    }
    const product = await findProductById(productId);
    if (!product || !product.isActive) {
        throw new ApiError(404, 'Product not found');
    }
    if (updateData.variants) {
        for (
            let i = 0;
            i < updateData.variants.length;
            i++
        ) {
            if (
                updateData.variants[i].sku !== product.variants[i]?.sku
            ) {
                throw new ApiError(400, 'SKU cannot be updated');
            };
        }
    }
    if (updateData.name) {
        const slug = slugify(updateData.name);
        const existingProduct = await findProductBySlug(slug);
        if (existingProduct && existingProduct._id.toString() !== productId) {
            throw new ApiError(409, 'Product already exists');
        }
        updateData.slug = slug;
    }
    if (updateData.category) {
        if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
            throw new ApiError(400, 'Invalid category id');
        }
        const category = await findCategoryById(updateData.category);
        if (!category || !category.isActive) {
            throw new ApiError(404, 'category not found');
        }
    }
    return updateProductById(productId, updateData);
};

const deleteProduct = async (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, 'Invalid product id');
    }
    const product = await findProductById(productId);
    if (!product || !product.isActive) {
        throw new ApiError(404, 'Product not found');
    }
    product.isActive = false;
    await product.save();
};

module.exports = {
    createProduct,
     getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};