const Branch = require("../models/Branch")

const createBranch = async (req, res) => {
    try {
        const { address, phoneNumber, openingHour, closingHour } = req.body
        if (!address?.city || !address?.street || !address?.streetNum) {
            return res.status(400).json({ message: "INVALID_ADDRESS", })
        }
        if (!phoneNumber || !/^0[2-9]\d{7}$/.test(phoneNumber)) {
            return res.status(400).json({ message: "INVALID_PHONE" })
        }

        if (!openingHour || typeof openingHour !== 'string') {
            return res.status(400).json({ message: "INVALID_OPENING_HOUR" })
        }

        if (!closingHour || typeof closingHour !== 'object') {
            return res.status(400).json({ message: "INVALID_CLOSING_HOUR" })
        }

        const duplicate = await Branch.findOne({ 'address.city': address.city, 'address.street': address.street, 'address.streetNum': address.streetNum }).lean()
        if (duplicate) {
            return res.status(409).json({ message: "BRANCH_EXISTS" })
        }
        const branch = await Branch.create({ address, phoneNumber, openingHour, closingHour })
        if (branch) {
            return res.status(201).json(branch)
        }
        else {
            return res.status(400).json({ message: "INTERNAL_ERROR" })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "INTERNAL_ERROR" })
    }

}
const readBranch = async (req, res) => {
    try {
        const branches = await Branch.find().lean()
        if (!branches?.length) {
            return res.status(404).json({ message: "NO_BRANCHES_FOUND" });
        }
        return res.status(200).json(branches)
    }
    catch (err) {
        return res.status(500).json({ message: "INTERNAL_ERROR" })
    }
}

const readBranchByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city || typeof city !== 'string') {
            return res.status(400).json({ message: "INVALID_CITY" });
        }
        const branches = await Branch.find({
            "address.city": { $regex: `^${city}`, $options: "i" }
        }).lean();
        if (!branches?.length) {
            return res.status(404).json({ message: "NO_BRANCH_IN_CITY" });
        }
        return res.status(200).json(branches)
    }
    catch (err) {
        return res.status(500).json({ message: "INTERNAL_ERROR" })
    }
}

const updateBranch = async (req, res) => {
    try {
        const { _id, address, phoneNumber, openingHour, closingHour } = req.body
        if (!_id) {
            return res.status(400).json({ message: "INVALID_BRANCH_ID" })
        }
        const branch = await Branch.findById(_id).exec()
        if (!branch) {
            return res.status(404).json({ message: "BRANCH_NOT_FOUND" })
        }
        if (address) {
            branch.address.city = address.city || branch.address.city
            branch.address.street = address.street || branch.address.street
            branch.address.streetNum = address.streetNum || branch.address.streetNum
        }
        if (phoneNumber) {
            if (!/^0[2-9]\d{7}$/.test(phoneNumber)) {
                return res.status(400).json({ message: "INVALID_PHONE" })
            }
            branch.phoneNumber = phoneNumber
        }
        if (openingHour) { branch.openingHour = openingHour }
        if (closingHour) {
            branch.closingHour.weekdays = closingHour.weekdays || branch.closingHour.weekdays
            branch.closingHour.fridays = closingHour.fridays || branch.closingHour.fridays
        }
        const updatedBranch = await branch.save()
        return res.status(200).json({ message: "BRANCH_UPDATED" })
    }
    catch (err) {
        return res.status(500).json({ message: "INTERNAL_ERROR" })
    }
}

const deleteBranch = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ message: "INVALID_BRANCH_ID" })
        }
        const branch = await Branch.findById(_id).exec()
        if (!branch) {
            return res.status(404).json({ message: "BRANCH_NOT_FOUND" })
        }
        const result = await branch.deleteOne()
        return res.status(200).json({ message: `Branch with ID ${_id} deleted successfully` });
    }
    catch (err) {
        return res.status(500).json({ message: "INTERNAL_ERROR" })
    }

}

module.exports = { createBranch, readBranch, readBranchByCity, updateBranch, deleteBranch }