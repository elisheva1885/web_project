const { default: mongoose } = require("mongoose");
const Company = require("../models/airconditioners/Company")

const createCompany = async (req, res) => {
    const name = req.body.name;
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ message: "INVALID_NAME" });
    }
    const imagepath = req.file?.filename;
    if (!imagepath || typeof imagepath !== 'string') {
        return res.status(400).json({ message: "INVALID_IMAGE_PATH" });
    }

    const duplicate = await Company.findOne({ name: name }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "NAME_ALREADY_EXISTS" })
    }
    const company = await Company.create({ name, imagePath: imagepath })

    if (company) {
        res.status(201).json(company)
    }
    else {
        return res.status(400).json({ message: "INTERNAL_ERROR" })
    }

}


const readCompany = async (req, res) => {
    try {
        const companies = await Company.find().lean()
        if (!companies?.length) {
            return res.status(404).json({ message: "NO_COMPANIES_FOUND" })
        }
        return res.status(200).json(companies)
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readCompanyByName = async (req, res) => {
    const { name } = req.params
    // console.log(name);
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: "INVALID_NAME" });
    }
    try {
        const company = await Company.findOne({ name: name }).lean()
        console.log(company);
        if (!company) {
            return res.status(404).json({ message: "COMPANY_NOT_FOUND" })
        }
        res.status(200).json(company)
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}



const deleteCompany = async (req, res) => {
    const { _id } = req.body
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "INVALID_COMPANY_ID" });
    }
    try {
        const company = await Company.findById(_id).exec()
        if (!company) {
            return res.status(400).json({ message: "COMPANY_NOT_FOUND" })
        }
        const result = await company.deleteOne()
        const companies = await Company.find().lean()
        if (!companies?.length) {
            return res.status(404).json({ message: "NO_COMPANIES_FOUND" })
        }
        return res.status(200).json(companies)
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createCompany, readCompany, deleteCompany, readCompanyByName }