const express = require("express")
const OrderController = require("../controllers/order")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

router.post("/placeOrder",verifyToken, OrderController.placeOrder)
router.post("/cancelOrder",verifyToken, OrderController.cancelOrder)
router.get("/getOrder/:orderId",verifyToken,OrderController.getOrderById)
router.get("/getOrders/:userId",verifyToken, OrderController.orderHistory)

module.exports = router