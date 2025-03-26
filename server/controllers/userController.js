const User = require("../models/User")
const updateUser = async (req, res) => {
    const {_id, email, phone } = req.body
    if(!_id){
        return res.status(400).json({message: "error on updating"})
    }
    if (!email && !phone) {
        return res.status(400).json({ message: "nothing changed" })
    }
    const user = await User.findById(_id).exec()
    if (!user) {
        return res.status(404).json({ message: "no such user" })
    }
    if (email) {
        user.email = email
    }
    if (phone) {
        user.phone = phone
    }
    const updatedUser = await User.save()
    const users = await User.find().lean()
    res.status(200).json(users)  

}

module.exports = { updateUser}