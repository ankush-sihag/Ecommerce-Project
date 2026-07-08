const mongoose = require("mongoose");

const {
  findCartByUserId,
  findCartWithProducts,
  createCart,
  saveCart,
  deleteCartById,
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
    throw new ApiError(400, "Quantity must be at least 0");
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

const getCart = async (userId) => {
    const cart = await findCartWithProducts(userId);
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    return cart;
};

const updateCartItemQuantity = async (
    userId,
    cartItemId,
    quantity
) => {

    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        throw new ApiError(400, "Invalid cart item id");
    }

    if (!quantity || quantity < 1) {
        throw new ApiError(
            400,
            "Quantity must be greater than 0"
        );
    }

    const cart = await findCartByUserId(userId);
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const cartItem = cart.cartItems.id(cartItemId);
    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    const product = await findProductById(cartItem.product);
    if (!product || !product.isActive) {
        throw new ApiError(404, "Product not found");
    }

    const variant = product.variants.id(cartItem.variant);
    if (!variant) {
        throw new ApiError(404, "Variant not found");
    }

    if (quantity > variant.stock) {
        throw new ApiError(
            400,
            `Only ${variant.stock} items available`
        );
    }

    cartItem.quantity = quantity;
    await saveCart(cart);
    return cart;
};

const removeCartItem = async (
    userId,
    cartItemId
) => {

    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        throw new ApiError(400, "Invalid cart item id");
    }

    const cart = await findCartByUserId(userId);
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const cartItem = cart.cartItems.id(cartItemId);
    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    cartItem.deleteOne();
    await saveCart(cart);
    return cart;
};

const clearCart = async (userId) => {

    const cart = await findCartByUserId(userId);
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.cartItems = [];
    await saveCart(cart);
    return {
        message: "Cart cleared successfully",
    };
};

module.exports = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};