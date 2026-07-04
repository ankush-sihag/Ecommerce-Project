const Cart = require("./cart.model");

const findCartByUserId = async (userId) => {
  return Cart.findOne({ user: userId });
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
    createCart,
    saveCart,
    deleteCartById,
};