const Product = require('./product.model');

const createProduct = async (productData) => {
    return Product.create(productData);
};

const findProductBySlug = async (slug) => {
    return Product.findOne({ slug });
};

const findProductBySku = async (sku) => {
    return Product.findOne({ 'variants.sku': sku });
};

module.exports = {
    createProduct,
    findProductBySlug,
    findProductBySku,
};