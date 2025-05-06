const MultiIndoorUnit = require("../models/airconditioners/MultiIndoorUnit")


const createMultiIndoorUnit = async (req, res) => {
    const otherDataString = req.body.otherData;
    if (!otherDataString) {
        return res.status(400).json({ message: "INVALID_OTHER_DATA" })
    }
    let otherData;
    try {
        otherData = JSON.parse(otherDataString);
    } catch (error) {
        return res.status(400).json({ message: "INVALID_OTHER_DATA_FORMAT" });
    }
    const { company, title, describe, stock, price, BTU_output, CFM, pipe_connection, evaporator_unit_dimensions } = otherData
    if (!company || !title || !describe || !price || typeof company !== "string" || typeof title !== "string" || typeof describe !== "string" || typeof price !== "number" || price <= 0) {
        return res.status(400).json({ message: "REQUIRED_FIELDS_MISSING" });
    }
    const imagepath = req.file?.filename;
    if (!imagepath) {
        return res.status(400).json({ message: "INVALID_IMAGE" })
    }
    try {
        const duplicate = await MultiIndoorUnit.findOne({ title: title }).populate("company").lean()
        if (duplicate) {
            return res.status(409).json({ message: "MULTIINDOORUNIT_ALREADY_EXIST" })
        }
        const multiIndoorUnit = await MultiIndoorUnit.create({ company, title, describe, imagepath, stock, price, BTU_output, CFM, pipe_connection, evaporator_unit_dimensions })
        if (multiIndoorUnit) {
            return res.status(201).json(multiIndoorUnit)
        }
        else {
            return res.status(400).json({ message: "MULTIINDOORUNIT_CREATION_FAILED" });
        }
    } catch (error) {
        console.error("Error creating MultiIndoorUnit:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMultiIndoorUnits = async (req, res) => {
    try {
        const multiIndoorUnits = await MultiIndoorUnit.find().populate("company").lean()
        if (!multiIndoorUnits?.length) {
            return res.status(404).json({ message: "NO_MULTIINDOORUNITS_FOUND" })
        }
        return res.status(200).json(multiIndoorUnits)
    } catch (error) {
        console.error("Error fetching multiIndoorUnits:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMultiIndoorUnitsByTitle = async (req, res) => {
    const { title } = req.params
    if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ message: "INVALID_TITLE" });
    }

    try {
        const multiIndoorUnits = await MultiIndoorUnit.find({ title: { "$regex": `^${title}`, "$options": "i" } }).populate("company").lean()
        if (!multiIndoorUnits?.length) {
            return res.status(404).json({ message: "NO_MULTIINDOORUNITS_FOUND" })
        }
        return res.status(200).json(multiIndoorUnits)
    } catch (error) {
        console.error("Error fetching multiIndoorUnits:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMultiIndoorUnitById = async (req, res) => {
    const { _id } = req.params
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIINDOORUNIT_ID" });
    }

    try {
        const multiIndoorUnit = await MultiIndoorUnit.findById(_id).populate("company").lean()
        if (!multiIndoorUnit)
            return res.status(404).json({ message: "MULTIINDOORUNIT_NOT_FOUND" })
        return res.status(200).json(multiIndoorUnit)
    } catch (error) {
        console.error("Error fetching multiIndoorUnit by ID:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updateMultiIndoorUnit = async (req, res) => {
    const { _id, company, title, describe, imagepath, stock, price, BTU_output, CFM, pipe_connection, evaporator_unit_dimensions } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIINDOORUNIT_ID" });
    }

    try {
        const multiIndoorUnit = await MultiIndoorUnit.findById(_id).exec()

        if (!multiIndoorUnit) {
            return res.status(404).json({ message: "MULTIINDOORUNIT_NOT_FOUND" })
        }
        multiIndoorUnit.title = title ? title : multiIndoorUnit.title
        multiIndoorUnit.describe = describe ? describe : multiIndoorUnit.describe
        multiIndoorUnit.imagepath = imagepath ? imagepath : multiIndoorUnit.imagepath
        multiIndoorUnit.stock = stock ? stock : multiIndoorUnit.stock
        // multiIndoorUnit.price= multiIndoorUnit.price
        multiIndoorUnit.BTU_output = BTU_output ? BTU_output : multiIndoorUnit.BTU_output
        multiIndoorUnit.CFM = CFM ? CFM : multiIndoorUnit.CFM
        multiIndoorUnit.pipe_connection = pipe_connection ? pipe_connection : multiIndoorUnit.pipe_connection
        multiIndoorUnit.evaporator_unit_dimensions = evaporator_unit_dimensions ? evaporator_unit_dimensions : multiIndoorUnit.evaporator_unit_dimensions
        const updated = await multiIndoorUnit.save()
        return res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating multiIndoorUnit:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const deleteMultiIndoorUnit = async (req, res) => {
    const { _id } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIINDOORUNIT_ID" });
    }
    try {
        const multiIndoorUnit = await MultiIndoorUnit.findById(_id).exec()
        if (!multiIndoorUnit) {
            return res.status(404).json({ message: "MULTIINDOORUNIT_NOT_FOUND" })
        }
        const result = await multiIndoorUnit.deleteOne()
        return res.status(200).json({ message: "MULTIINDOORUNIT_DELETED_SUCCESSFULLY" })
    } catch (error) {
        console.error("Error deleting multiIndoorUnit:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updatMultiIndoorUnitStock = async (req, res) => {
    const { _id, amount } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIINDOORUNIT_ID" });
    }

    if (amount === undefined || typeof amount !== "number" || amount < 0) {
        return res.status(400).json({ message: "INVALID_STOCK_AMOUNT" });
    }

    try {
        const multiIndoorUnit = await MultiIndoorUnit.findById(_id).populate("company").exec()
        if (!multiIndoorUnit) {
            return res.status(404).json({ message: "MULTIINDOORUNIT_NOT_FOUND" });
        }

        if (multiIndoorUnit.stock < amount) {
            return res.status(400).json({ message: "INSUFFICIENT_STOCK" });
        }
        multiIndoorUnit.stock -= amount;
        const updated = await multiIndoorUnit.save()
        return res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MultiIndoorUnit stock:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}


const updatMultiIndoorUnitPrice = async (req, res) => {
    const { _id, price } = req.body
    console.log(_id);
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIINDOORUNIT_ID" });
    }

    if (price === undefined  || price <= 0) {
        return res.status(400).json({ message: "INVALID_PRICE" });
    }

    try {
        const multiIndoorUnit = await MultiIndoorUnit.findById(_id).populate("company").exec()
        if (!multiIndoorUnit) {
            return res.status(404).json({ message: "MULTIINDOORUNIT_NOT_FOUND" })
        }
        console.log(multiIndoorUnit);
        multiIndoorUnit.price = price
        const updated = await multiIndoorUnit.save()
        return res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MultiIndoorUnit price:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createMultiIndoorUnit, readMultiIndoorUnits, readMultiIndoorUnitsByTitle, readMultiIndoorUnitById, updateMultiIndoorUnit, updatMultiIndoorUnitStock, updatMultiIndoorUnitPrice, deleteMultiIndoorUnit } 