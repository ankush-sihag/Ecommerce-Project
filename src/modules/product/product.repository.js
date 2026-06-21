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

const findAllProducts = async () => {
    return Product.find({ isActive: true }).populate('category', 'name slug');
};

const findProductById = async(productId) => {
    return Product.findById(productId).populate('category', 'name slug');
};

const updateProductById = async (productId, updateData) => {
    return Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true }).populate("category", "name slug");
};

module.exports = {
    createProduct,
    findProductBySlug,
    findProductBySku,
    findAllProducts,
    findProductById,
    updateProductById,    
};