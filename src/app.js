const express = require('express');

const userRoutes = require('./modules/user/user.routes');

const categoryRoutes = require('./modules/category/category.routes');

const productRoutes = require('./modules/product/product.routes');

const cartRoutes = require("./modules/cart/cart.routes");

const orderRoutes = require("./modules/order/order.routes");

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/products', productRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('E-Commerce Backend Running...');
});

const errorMiddleware = require('./middlewares/error.middleware');

app.use(errorMiddleware);

module.exports = app;

