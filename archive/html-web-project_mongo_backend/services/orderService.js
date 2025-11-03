const Order = require('../models/order');

class OrderService {
    async createOrder(orderData) {
        const newOrder = new Order(orderData);
        return await newOrder.save();
    }

    async getOrderById(orderId) {
        return await Order.findById(orderId);
    }

    async getUserOrderHistory(userId) {
        return await Order.find({ userId: userId }).sort({ createdAt: -1 });
    }

    async updateOrderStatus(orderId, status) {
        return await Order.findByIdAndUpdate(orderId, { status: status }, { new: true });
    }

    async trackOrder(orderId) {
        return await this.getOrderById(orderId);
    }
}

module.exports = new OrderService();