const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const {
  addToCart,
} = require("./cart.controller");

router.post(
  "/",
  authMiddleware,
  addToCart
);

module.exports = router;