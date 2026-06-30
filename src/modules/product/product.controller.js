const asyncHandler = require('../../utils/asyncHandler');

const {
    createProduct: createProductService,
    getAllProducts: getAllProductsService,
    getProductById: getProductByIdService,
    updateProduct: updateProductService,
    deleteProduct: deleteProductService,
} = require('./product.service');

const createProduct = asyncHandler(async (req, res) => {
    const product = await createProductService(req.body);
    res.status(201).json({
        success: true,
        message: "Product created succcessfully",
        data: product,
    });
});

const getAllProducts =
  asyncHandler(async (req, res) => {
      const products =await getAllProductsService();
      res.status(200).json({
        success: true,
        count:products.length,
        data: products,
      });
    });

const getProductById =
  asyncHandler(async (req, res) => {
      const product =await getProductByIdService(req.params.id);
      res.status(200).json({
        success: true,
        data: product,
      });
    });

const updateProduct =
  asyncHandler(async (req, res) => {
      const product =await updateProductService(
          req.params.id,
          req.body
        );
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    });

const deleteProduct = asyncHandler(async (req, res) => {
      await deleteProductService(req.params.id);
      res.status(200).json({
        success: true,
        message:  "Product deleted successfully",
      });
    });


module.exports =  { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };