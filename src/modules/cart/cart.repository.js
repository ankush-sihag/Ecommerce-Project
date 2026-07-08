const Cart = require("./cart.model");

const findCartByUserId = async (userId) => {
  return Cart.findOne({ user: userId });
};

const findCartWithProducts = async (userId) => {
  return Cart.findOne({ user: userId })
      .populate(
          'cartItems.product',
          'name slug images variants isActive'
      );
};

const createCart = async (cartData) => {
    return Cart.create(cartData);
};

const saveCart = async (cart) => {
  return cart.save();
};

const deleteCartById = async (cartId) => {
  return Cart.findByIdAndDelete(cartId);
};

module.exports = {
    findCartByUserId,
    findCartWithProducts,
    createCart,
    saveCart,
    deleteCartById,
};