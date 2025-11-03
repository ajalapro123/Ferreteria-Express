const Order = require('../models/order');
const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await orderService.createOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await orderService.getOrderHistory(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order history', error });
    }
};

exports.trackOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const orderStatus = await orderService.trackOrder(orderId);
        res.status(200).json(orderStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error tracking order', error });
    }
};