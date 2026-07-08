const asyncHandler = require("../../utils/asyncHandler");

const {
  addToCart: addToCartService,
  getCart: getCartService,
  updateCartItemQuantity: updateCartItemQuantityService,
  removeCartItem: removeCartItemService,
  clearCart: clearCartService,
} = require("./cart.service");

const addToCart = asyncHandler(async (req, res) => {
  const cart = await addToCartService(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Item added to cart successfully",
    data: cart,
  });
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await getCartService(req.user.id);

    res.status(200).json({
        success: true,
        data: cart,
    });
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const cart = await updateCartItemQuantityService(
        req.user.id,
        req.params.cartItemId,
        req.body.quantity
    );

    res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: cart,
    });
});

const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await removeCartItemService(
        req.user.id,
        req.params.cartItemId
    );

    res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cart,
    });
});

const clearCart = asyncHandler(async (req, res) => {
    const result = await clearCartService(req.user.id);

    res.status(200).json({
        success: true,
        message: result.message,
    });
});

module.exports = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};