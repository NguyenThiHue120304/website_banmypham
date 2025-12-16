const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('Không có sản phẩm nào trong giỏ');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
};

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!order.isDelivered) {
            await order.deleteOne();
            res.json({ message: 'Đơn hàng đã được hủy thành công' });
        } else {
            res.status(400);
            throw new Error('Không thể hủy đơn hàng đã được giao hoặc đang vận chuyển!');
        }
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    getOrderById,
    deleteOrder
};
