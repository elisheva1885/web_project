const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const User = require("../models/User")
const register = async (req, res) => {
    try {
        const { name, username, password, email, phone } = req.body
        // Validate name
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "Name is required and must be a valid string" });
        }

        // Validate username
        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: "Username is required and must be a valid string" });
        }

        const duplicate = await User.findOne({ username: username }).lean()
        if (duplicate) {
            return res.status(409).json({ message: "username is already taken" })
        }
        // Validate password
        if (!password || typeof password !== 'string' || password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const userObject = { name, username, password: hashedPassword, email, phone }
        const user = await User.create(userObject)
        if (user) {
            return res.status(201).json({ message: `New user ${user.username} created successfully` });
        }
        else {
            return res.status(400).json({ message: "Invalid user data received" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, username, password, email, phone, roles } = req.body;
        // Validate name
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "Name is required and must be a valid string" });
        }
        // Validate username
        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: "Username is required and must be a valid string" });
        }
        // Check for duplicate username
        const duplicate = await User.findOne({ username: username }).lean();
        if (duplicate) {
            return res.status(409).json({ message: "Username is already taken" });
        }
        // Validate password
        if (!password || typeof password !== 'string' || password.length < 8 ||
            !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters"
            });
        }
        // Validate email (optional)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        // Validate phone (optional)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const userObject = { name, username, password: hashedPassword, email, phone, roles }
        const user = await User.create(userObject)
        if (user) {
            return res.status(201).json({ message: `New User ${user.username} created` })
        }
        else {
            return res.status(400).json({ message: "invalid user recived" })
        }
    }
    catch (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: "Username is required and must be a valid string" });
        }
        if (!password || typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({ message: "Password is required and must be a valid string" });
        }
        const foundUser = await User.findOne({ username }).lean()
        if (!foundUser) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const match = await bcrypt.compare(password, foundUser.password)
        if (!match) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const userInfo = {
            _id: foundUser._id, name: foundUser.name,
            username: foundUser.username,
            email: foundUser.email, phone: foundUser.phone, roles: foundUser.roles
        }
        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ token: accessToken, name: userInfo.name, username: userInfo.username, email: userInfo.email, phone: userInfo.phone, role: userInfo.roles })
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { login, register, registerAdmin }