const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        name : String,
        cost : Number
    }],
    status: {
        type: String,
        enum: ['Placed', 'Canceled'],
        default: 'Placed'
    },
    total : {
        type : Number,
        default : 0
    }
}, { timestamps: true })

const Order = mongoose.model("Order", OrderSchema)

module.exports = Order