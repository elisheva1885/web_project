const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const register = async (req, res) => {
    try {
        const { name, username, password, email, phone } = req.body;
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "INVALID_NAME" });
        }

        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: "INVALID_USERNAME" });
        }

        const duplicate = await User.findOne({ username }).lean();
        if (duplicate) {
            return res.status(409).json({ message: "USERNAME_TAKEN" });
        }

        if (!password || typeof password !== 'string' || password.length < 8 ||
            !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ message: "INVALID_PASSWORD" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "INVALID_EMAIL" });
        }

        const phoneRegex = /^05\d{8}$/;
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "INVALID_PHONE" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userObject = { name, username, password: hashedPassword, email, phone };
        const user = await User.create(userObject);

        if (user) {
            return res.status(201).json(user);
        } else {
            return res.status(400).json({ message: "INVALID_USER_DATA" });
        }

    } catch (error) {
        e.error(error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
};

const registerAdmin = async (req, res) => {
    try {
        const { name, username, password, email, phone, roles } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "INVALID_NAME" });
        }

        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: "INVALID_USERNAME" });
        }

        const duplicate = await User.findOne({ username }).lean();
        if (duplicate) {
            return res.status(409).json({ message: "USERNAME_TAKEN" });
        }

        if (!password || typeof password !== 'string' || password.length < 8 ||
            !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ message: "INVALID_PASSWORD" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "INVALID_EMAIL" });
        }

        const phoneRegex = /^05\d{8}$/;
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ message: "INVALID_PHONE" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userObject = { name, username, password: hashedPassword, email, phone, roles };
        const user = await User.create(userObject);

        if (user) {
            return res.status(201).json({ message: `New user ${user.username} created successfully` });
        } else {
            return res.status(400).json({ message: "INVALID_USER_DATA" });
        }

    } catch (error) {
        e.error(error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({ message: "INVALID_CREDENTIALS" });
        }

        const foundUser = await User.findOne({ username }).lean();
        if (!foundUser) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }

        const userInfo = {
            _id: foundUser._id,
            name: foundUser.name,
            username: foundUser.username,
            email: foundUser.email,
            phone: foundUser.phone,
            roles: foundUser.roles
        };

        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({
            token: accessToken,
            name: userInfo.name,
            username: userInfo.username,
            email: userInfo.email,
            phone: userInfo.phone,
            role: userInfo.roles
        });

    } catch (error) {
        e.error(error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
};

module.exports = { login, register, registerAdmin };
