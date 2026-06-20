const mongoose = require('mongoose');
const { prependListener } = require('../category/category.model');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                alt: {
                    type: String,
                    default: "",
                },
            },
        ],
        variants: [
            {
                colors: {
                    type: String,
                    required: true,
                },
                size: {
                    type: String,
                    required: true,
                },
                sku: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                stock: {
                    type: Number,
                    required: true,
                    default: 0,
                },
            },
        ],
        isActive: {
            type: Boolian,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;