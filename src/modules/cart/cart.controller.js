const asyncHandler = require("../../utils/asyncHandler");

const {
  addToCart: addToCartService,
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

module.exports = {
  addToCart,
};