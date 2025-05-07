const Address = require("../models/Address")
const User = require('../models/User')

//checked
const createAddress = async (req, res) => {
    try {
        const user_id = req.user?._id
        const { country, city, street, building_num, apartment_num, floor, zip_code } = req.body
        if (!user_id) {
            return res.status(400).json({ message: "INVALID_USER_ID" });
        }
        const requiredFields = ['country', 'city', 'street', 'building_num', 'apartment_num', 'floor', 'zip_code'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `MISSING_FIELD` });
            }
        }
        if (typeof country !== 'string' || country.trim() === '') {
            return res.status(400).json({ message: "INVALID_COUNTRY" });
        }
        if (typeof city !== 'string' || city.trim() === '') {
            return res.status(400).json({ message: "INVALID_CITY" });
        }
        if (typeof street !== 'string' || street.trim() === '') {
            return res.status(400).json({ message: "INVALID_STREET" });
        }
        if (typeof building_num !== 'number' || building_num <= 0) {
            return res.status(400).json({ message: "INVALID_BUILDING_NUMBER" });
        }
        if (typeof apartment_num !== 'number' || apartment_num <= 0) {
            return res.status(400).json({ message: "INVALID_APARTMENT_NUMBER" });
        }
        if (typeof floor !== 'number') {
            return res.status(400).json({ message: "INVALID_FLOOR" });
        }
        if (typeof zip_code !== 'string' || zip_code.trim() === '') {
            return res.status(400).json({ message: "INVALID_ZIP_CODE" });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "USER_NOT_FOUND" });
        }
        const existingAddress = await Address.findOne({ user_id });
        if (existingAddress) {
            return res.status(409).json({ message: "ADDRESS_ALREADY_EXISTS" });
        }
        const address = await Address.create({ user_id, country, city, street, building_num, apartment_num, floor, zip_code })
        if (address) {
            return res.status(201).json(address)
        }
        else {
            return res.status(400).json({ message: "ADDRESS_CREATION_FAILED" })
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}


const readAddressesByUserId = async (req, res) => {
    try {
        const _id = req.user?._id
        if (!_id || typeof _id !== "string" || _id.length !== 24) {
            return res.status(400).json({ message: "INVALID_USER_ID" });
        }
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "USER_NOT_FOUND" });
        }

        const address = await Address.find({user_id: _id }).lean()

        if (!address || address.length === 0) {
            return res.status(404).json({ message: "NO_ADDRESS_FOUND" });
        }
        return res.status(200).json({ address });
    }
    catch (error) {
        console.error("Error reading addresses by user ID:",error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

const updateAddress = async (req, res) => {
    try {
        const { _id, country, city, street, building_num, apartment_num, floor, zip_code } = req.body
        if (!_id || typeof _id !== "string" || _id.length !== 24) {
            return res.status(400).json({ message: "INVALID_ADDRESS_ID" });
        }

        if (!country && !city && !street && !building_num && !apartment_num && !floor && !zip_code) {
            return res.status(400).json({ message: "NO_FIELDS_TO_UPDATE" });
        }
        const address = await Address.findById(_id).exec()
        if (!address) {
            return res.status(404).json({ message: "ADDRESS_NOT_FOUND" });
        }

        if (city !== undefined && (typeof city !== 'string' || city.trim() === '')) {
            return res.status(400).json({ message: "INVALID_CITY" });
        }
        if (street !== undefined && (typeof street !== 'string' || street.trim() === '')) {
            return res.status(400).json({ message: "INVALID_STREET" });
        }
        if (building_num !== undefined && (typeof building_num !== 'number' || building_num <= 0)) {
            return res.status(400).json({ message: "INVALID_BUILDING_NUMBER" });
        }
        if (apartment_num !== undefined && (typeof apartment_num !== 'number' || apartment_num <= 0)) {
            return res.status(400).json({ message: "INVALID_APARTMENT_NUMBER" });
        }
        if (floor !== undefined && typeof floor !== 'number') {
            return res.status(400).json({ message: "INVALID_FLOOR" });
        }
        if (zip_code !== undefined && (typeof zip_code !== 'string' || zip_code.trim() === '')) {
            return res.status(400).json({ message: "INVALID_ZIP_CODE" });
        }

        if (country) address.country = country;
        if (city) address.city = city;
        if (street) address.street = street;
        if (building_num) address.building_num = building_num;
        if (apartment_num) address.apartment_num = apartment_num;
        if (floor) address.floor = floor;
        if (zip_code) address.zip_code = zip_code;

        const updatedAddress = await address.save();
        return res.status(200).json(updatedAddress)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id || typeof _id !== "string" || _id.length !== 24) {
            return res.status(400).json({ message: "INVALID_ADDRESS_ID" });
        }
        const address = await Address.findById(_id).exec()
        if (!address) {
            return res.status(404).json({ message: "ADDRESS_NOT_FOUND" })
        }
        const result = await address.deleteOne()
        return res.status(200).json({ message: `ADDRESS_DELETED_SUCCESSFULLY` });
    }
    catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

module.exports = { createAddress, readAddressesByUserId, updateAddress, deleteAddress }