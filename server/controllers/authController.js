const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const User = require("../models/User")
const register = async (req, res) => {
    const { name, username, password, email, phone } = req.body
    if (!name || !username || !password) {
        return res.status(400).json({ message: "all field are reqired" })
    }
    const duplicate = await User.findOne({ username: username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "username is already taken" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userObject = { name, username, password: hashedPassword, email, phone }
    const user = await User.create(userObject)
    if (user) {
        return res.status(201).json({ message: `New User ${user.username} created` })
    }
    else {
        return res.status(400).json({ message: "invalid user recived" })
    }
}

const registerAdmin = async (req, res) => {
    const { name, username, password, email, phone , roles} = req.body
    console.log(name, username, password, email, phone , roles);
    if (!name || !username || !password) {
        return res.status(400).json({ message: "all field are reqired" })
    }
    const duplicate = await User.findOne({ username: username }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "username is already taken" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userObject = { name, username, password: hashedPassword, email, phone , roles}
    const user = await User.create(userObject)
    if (user) {
        return res.status(201).json({ message: `New User ${user.username} created` })
    }
    else {
        return res.status(400).json({ message: "invalid user recived" })
    }
}

const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: "all field are reqired" })
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
        email: foundUser.email, pone: foundUser.phone, roles: foundUser.roles
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({token: accessToken, username: userInfo.username,role: userInfo.roles })
}

module.exports = { login, register, registerAdmin }