const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = require("./cart.controller");

router.post(
  "/",
  authMiddleware,
  addToCart
);

router.get(
  "/",
  authMiddleware,
  getCart
);

router.patch(
  "/items/:cartItemId",
  authMiddleware,
  updateCartItemQuantity
);

router.delete(
  "/items/:cartItemId",
  authMiddleware,
  removeCartItem
);

router.delete(
  "/",
  authMiddleware,
  clearCart
);

module.exports = router;