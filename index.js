const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const orderRoute = require("./routes/order")

const app = express();

dotenv.config()
app.use(bodyParser.json())

app.use("/user", userRoute)
app.use("/order", orderRoute)

app.get("/", (req, res) => {
    res.send("Hello");
})
app.use((err, req, res, next) => {
    const status = err.status || 500
    const msg = err.message || "Something went wrong"
    res.status(status).json({
        success: false,
        message: msg,
        stack: err.stack
    })
})
const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Database connected & Server running on port ${process.env.PORT}`))
}).catch((error) => {
    console.log(`Database connection error : ${error}`)
})

module.exports = app