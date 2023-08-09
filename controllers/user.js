const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const createError = require("../middleware/error")

const register = async (req, res, next) => {
    try {

        var { username, email, password } = req.body;

        let user = await User.findOne({ email: email })

        if (user) {
            return next(createError(403, "User Already Exists"))
        }
        if (password?.length === 0) {
            return next(createError(400, "Enter password"))
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash
        });
        const savedUser = await newUser.save();
        var { password, ...userDetails } = savedUser._doc
        res.status(201).json(userDetails);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        var { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        var { password, ...userDetails } = user._doc
        res.status(200).json({ token, userDetails });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getUserDetails = async (req, res, next) => {
    try {
        var { userId } = req.params;
        const user = await User.findOne({ _id: userId }).populate({
            path: 'orders'
        });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        if (userId !== req.user.id) {
            return next(createError(401, "You are not authorized to view user details"))
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login,
    getUserDetails
}