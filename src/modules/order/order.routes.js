const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
} = require("./order.controller");

router.post(
    "/",
    authMiddleware,
    createOrder
);

router.get(
    "/",
    authMiddleware,
    getMyOrders
);

router.get(
    "/:orderId",
    authMiddleware,
    getOrderById
);

router.patch(
    "/:orderId/cancel",
    authMiddleware,
    cancelOrder
);

module.exports = router;