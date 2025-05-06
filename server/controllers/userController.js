const User = require("../models/User")
const updateUser = async (req, res) => {
    const _id = req.user?._id
    const { email, phone } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_USER_ID" });
    }

    if (!email && !phone) {
        return res.status(400).json({ message: "NO_FIELDS_TO_UPDATE" });
    }
    try {
        const user = await User.findById(_id).exec()
        if (!user) {
            return res.status(404).json({ message: "USER_NOT_FOUND" })
        }
        if (email) {
            user.email = email
        }
        if (phone) {
            user.phone = phone
        }

        const updatedUser = await user.save()
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { updateUser }