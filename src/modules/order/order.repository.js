const Order = require("./order.model");

const createOrder = async (orderData) => {
    return Order.create(orderData);
};

const findOrdersByUserId = async (userId) => {
    return Order.find({ user: userId })
        .sort({ createdAt: -1 });
};

const findOrderById = async (orderId) => {
    return Order.findById(orderId);
};

const saveOrder = async (order) => {
    return order.save();
};

const deleteOrderById = async (orderId) => {
    return Order.findByIdAndDelete(orderId);
};

module.exports = {
    createOrder,
    findOrdersByUserId,
    findOrderById,
    saveOrder,
    deleteOrderById,
};