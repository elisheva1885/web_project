const Address = require("../models/Address")
const User = require('../models/User')

//checked
const createAddress = async (req, res) => {
    try {
        const user_id = req.user._id
        const { country, city, street, building_num, apartment_num, floor, zip_code } = req.body
        const requiredFields = ['country', 'city', 'street', 'building_num', 'apartment_num', 'floor', 'zip_code'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }
        if (typeof country !== 'string' || country.trim() === '') {
            return res.status(400).json({ message: "Invalid country" });
        }
        if (typeof city !== 'string' || city.trim() === '') {
            return res.status(400).json({ message: "Invalid city" });
        }
        if (typeof street !== 'string' || street.trim() === '') {
            return res.status(400).json({ message: "Invalid street" });
        }
        if (typeof building_num !== 'number' || building_num <= 0) {
            return res.status(400).json({ message: "Invalid building number" });
        }
        if (typeof apartment_num !== 'number' || apartment_num <= 0) {
            return res.status(400).json({ message: "Invalid apartment number" });
        }
        if (typeof floor !== 'number') {
            return res.status(400).json({ message: "Invalid floor" });
        }
        if (typeof zip_code !== 'string' || zip_code.trim() === '') {
            return res.status(400).json({ message: "Invalid zip code" });
        }
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingAddress = await Address.findOne({ user_id });
        if (existingAddress) {
            return res.status(409).json({ message: "User already has an address" });
        }
        const address = await Address.create({ user_id, country, city, street, building_num, apartment_num, floor, zip_code })
        if (address) {
            return res.status(201).json(address)
        }
        else {
            return res.status(400).json({ message: "invalid address" })
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


//checked
const readAddressesByUserId = async (req, res) => {
    try {
        const user_id = req.user._id
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const address = await Address.find({ user_id }).lean()

        if (!address || address.length === 0) {
            return res.status(404).json({ message: "No address found for this user" });
        }
        return res.status(200).json({ address });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
//checked
const updateAddress = async (req, res) => {
    try {
        const { _id, country, city, street, building_num, apartment_num, floor, zip_code } = req.body
        if (!_id) {
            return res.status(400).json({ message: "Address ID is required for updating" });
        }

        if (!country && !city && !street && !building_num && !apartment_num && !floor && !zip_code) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const address = await Address.findById(_id).exec()
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        if (city !== undefined) {
            if (typeof city !== 'string' || city.trim() === '') {
                return res.status(400).json({ message: "Invalid city" });
            }
            address.city = city;
        }
        if (street !== undefined) {
            if (typeof street !== 'string' || street.trim() === '') {
                return res.status(400).json({ message: "Invalid street" });
            }
            address.street = street;
        }
        if (building_num !== undefined) {
            if (typeof building_num !== 'number' || building_num <= 0) {
                return res.status(400).json({ message: "Invalid building number" });
            }
            address.building_num = building_num;
        }
        if (apartment_num !== undefined) {
            if (typeof apartment_num !== 'number' || apartment_num <= 0) {
                return res.status(400).json({ message: "Invalid apartment number" });
            }
            address.apartment_num = apartment_num;
        }
        if (floor !== undefined) {
            if (typeof floor !== 'number') {
                return res.status(400).json({ message: "Invalid floor" });
            }
            address.floor = floor;
        }
        if (zip_code !== undefined) {
            if (typeof zip_code !== 'string' || zip_code.trim() === '') {
                return res.status(400).json({ message: "Invalid zip code" });
            }
            address.zip_code = zip_code;
        }
        const updatedAddress = await address.save();
        return res.status(200).json(updateAddress)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ message: "Address ID is required for deletion" });
        }
        const address = await Address.findById(_id).exec()
        if (!address) {
            return res.status(404).json({ message: "Address not found" })
        }
        const result = await address.deleteOne()
        return res.status(200).json({ message: `Address with ID ${_id} deleted successfully` });
    }
    catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createAddress, readAddressesByUserId, updateAddress, deleteAddress }