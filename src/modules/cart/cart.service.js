const mongoose = require("mongoose");

const {
  findCartByUserId,
  createCart,
  saveCart,
} = require("./cart.repository");

const { findProductById } = require("../product/product.repository");

const ApiError = require("../../utils/ApiError");

const addToCart = async (userId, cartData) => {
  const { productId, variantId, quantity } = cartData;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    throw new ApiError(400, "Invalid variant id");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const product = await findProductById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new ApiError(404, "Variant not found");
  }

  let cart = await findCartByUserId(userId);

  if (!cart) {
    cart = await createCart({
      user: userId,
      cartItems: [],
    });
  }

  const existingItem = cart.cartItems.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant.toString() === variantId
  );

  if (existingItem) {
    const totalQuantity = existingItem.quantity + quantity;

    if (totalQuantity > variant.stock) {
      throw new ApiError(
        400,
        `Only ${variant.stock} items available`
      );
    }

    existingItem.quantity = totalQuantity;
  } else {
    if (quantity > variant.stock) {
      throw new ApiError(
        400,
        `Only ${variant.stock} items available`
      );
    }

    cart.cartItems.push({
      product: product._id,
      variant: variant._id,
      quantity,
      addedAt: new Date(),
    });
  }

  await saveCart(cart);

  return cart;
};

module.exports = {
  addToCart,
};