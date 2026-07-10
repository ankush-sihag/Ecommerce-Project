const mongoose = require("mongoose");

const ApiError = require("../../utils/ApiError");

const {
    createOrder,
    findOrdersByUserId,
    findOrderById,
    saveOrder,
} = require("./order.repository");

const {
    findCartByUserId,
    saveCart,
} = require("../cart/cart.repository");

const {
    findProductById,
    saveProduct,
} = require("../product/product.repository");

const createOrderService = async (userId, orderData) => {

    const {
        shippingAddress,
        paymentMethod,
    } = orderData;

    const allowedPaymentMethods = [
        "COD",
        "ONLINE",
    ];

    if (
        !allowedPaymentMethods.includes(paymentMethod)
    ) {
        throw new ApiError(
            400,
            "Invalid payment method"
        );
    }

    if (!shippingAddress) {
        throw new ApiError(
            400,
            "Shipping address is required"
        );
    }

    const {
        fullName,
        phone,
        addressLine1,
        city,
        state,
        pincode,
        country,
    } = shippingAddress;

    if (
        !fullName ||
        !phone ||
        !addressLine1 ||
        !city ||
        !state ||
        !pincode ||
        !country
    ) {
        throw new ApiError(
            400,
            "Complete shipping address is required"
        );
    }

    const cart = await findCartByUserId(userId);

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    if (cart.cartItems.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const orderItems = [];

    let totalAmount = 0;

    for (const cartItem of cart.cartItems) {

        const product = await findProductById(
            cartItem.product
        );

        if (!product) {
            throw new ApiError(
                404,
                "Product not found"
            );
        }

        if (!product.isActive) {
            throw new ApiError(
                400,
                `${product.name} is unavailable`
            );
        }

        const variant = product.variants.id(
            cartItem.variant
        );

        if (!variant) {
            throw new ApiError(
                404,
                "Variant not found"
            );
        }

        if (variant.stock < cartItem.quantity) {
            throw new ApiError(
                400,
                `Only ${variant.stock} items available for ${product.name}`
            );
        }

        const subtotal =
            variant.price * cartItem.quantity;

        totalAmount += subtotal;

        orderItems.push({

            productId: product._id,

            productName: product.name,

            productImage:
                product.images.length > 0
                    ? product.images[0].url
                    : "",

            sku: variant.sku,

            variantId: variant._id,

            color: variant.color,

            size: variant.size,

            priceAtPurchase: variant.price,

            quantity: cartItem.quantity,

            subtotal,

        });

    }

    for (const cartItem of cart.cartItems) {

        const product = await findProductById(
            cartItem.product
        );

        const variant = product.variants.id(
            cartItem.variant
        );

        variant.stock -= cartItem.quantity;

        await saveProduct(product);

    }

    const order = await createOrder({

        user: userId,

        items: orderItems,

        shippingAddress,

        paymentMethod,

        paymentStatus:
            paymentMethod === "COD"
                ? "PENDING"
                : "PAID",

        orderStatus: "PENDING",

        totalAmount,

    });

    cart.cartItems = [];

    await saveCart(cart);

    return order;

};

const getMyOrdersService = async (userId) => {

    const orders =
        await findOrdersByUserId(userId);

    return orders;

};

const getOrderByIdService = async (
    userId,
    orderId
) => {

    if (
        !mongoose.Types.ObjectId.isValid(orderId)
    ) {
        throw new ApiError(
            400,
            "Invalid order id"
        );
    }

    const order =
        await findOrderById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (
        order.user.toString() !== userId
    ) {
        throw new ApiError(
            403,
            "Unauthorized access"
        );
    }

    return order;

};

const cancelOrderService = async (
    userId,
    orderId
) => {

    if (
        !mongoose.Types.ObjectId.isValid(orderId)
    ) {
        throw new ApiError(
            400,
            "Invalid order id"
        );
    }

    const order =
        await findOrderById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (
        order.user.toString() !== userId
    ) {
        throw new ApiError(
            403,
            "Unauthorized access"
        );
    }

    if (
        order.orderstatus === "SHIPPED" ||
        order.orderStatus === "DELIVERED"
    ) {
        throw new ApiError(
            400,
            "order cannot be cancelled"
        );
    }

    if (
        order.orderStatus === "CANCELLED"
    ) {
        throw new ApiError(
            400,
            "Order already cancelled"
        );
    }

    for (const item of order.items) {

    const product = await findProductById(
        item.productId
    );

    if (!product) {
        continue;
    }

    const variant = product.variants.id(
        item.variantId
    );

    if (!variant) {
        continue;
    }

    variant.stock += item.quantity;

    await saveProduct(product);

}

order.orderStatus = "CANCELLED";

await saveOrder(order);

return order;

};

module.exports = {
    createOrderService,
    getMyOrdersService,
    getOrderByIdService,
    cancelOrderService,
};
