const asyncHandler = require("../../utils/asyncHandler");

const {
    createOrderService,
    getMyOrdersService,
    getOrderByIdService,
    cancelOrderService,
} = require("./order.service");

const createOrder = asyncHandler(async (req, res) => {

    const order = await createOrderService(
        req.user.id,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
    });

});

const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await getMyOrdersService(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: orders,
    });

});

const getOrderById = asyncHandler(async (req, res) => {

    const order = await getOrderByIdService(
        req.user.id,
        req.params.orderId
    );

    res.status(200).json({
        success: true,
        data: order,
    });

});

const cancelOrder = asyncHandler(async (req, res) => {

    const order = await cancelOrderService(
        req.user.id,
        req.params.orderId
    );

    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
    });

});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
};