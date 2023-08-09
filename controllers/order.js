const Order = require("../models/order")
const User = require("../models/user")
const createError = require("../middleware/error")

const placeOrder = async (req, res, next) => {
    try {
        const { products } = req.body;

        let user = await User.findOne({ _id: req.user.id });
        if (!user) {
            next(createError(404, "User Not Found"))
        }
        const order = new Order({ username: user._id, products });

        let totalCost = 0
        products.forEach((p) => {
            totalCost += p.cost
        })
        order.total += totalCost
        await order.save();

        user.orders.push(order);

        await user.save();

        res.status(201).json({ message: `Order placed successfully for ${user.username} with order id ${order._id}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error placing order' });
    }
}
const cancelOrder = async (req, res, next) => {
    try {
        const { orderId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(createError(401, "You are not authorized to cancel the order"))
        }

        const order = await Order.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'Canceled') {
            return res.status(400).json({ message: 'Order is already canceled' });
        }

        order.status = 'Canceled';
        await order.save();

        res.json({ message: `Order canceled successfully for order id ${orderId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error canceling order' });
    }
}
const orderHistory = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (userId !== req.user.id) {
            return next(createError(401, "You are not authorized to see the details"))
        }

        const user = await User.findOne({ _id: userId }).populate({
            path: 'orders'
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ orders: user.orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving order history' });
    }
}
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById({ _id: orderId })

        if (!order) {
            return res.status(404).json({ message: 'Order details not found' });
        }
        res.json({ data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving order detail' });
    }
}
module.exports = { placeOrder, cancelOrder, orderHistory, getOrderById }