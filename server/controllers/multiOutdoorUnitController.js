const MultiOutdoorUnit = require("../models/airconditioners/MultiOutdoorUnit")


const createMultiOutdoorUnit = async (req, res) => {
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
    const { company, title, describe, stock, price, BTU_output, working_current, condenser_unit_dimensions, quiet, wifi, timer, sabbath_command, onof_auto } = otherData
    if (!company || !title || !describe || !price || typeof price !== "number" || price <= 0) {
        return res.status(400).json({ message: "REQUIRED_FIELDS_MISSING" });
    }
    const imagepath = req.file?.filename;
    if (!imagepath) {
        return res.status(400).json({ message: "INVALID_IMAGE" })
    }
    try {
        const duplicate = await MultiOutdoorUnit.findOne({ title: title }).populate("company").lean()
        if (duplicate) {
            return res.status(409).json({ message: "MULTIOUTDOORUNIT_ALREADY_EXISTS" })
        }
        const multiOutdoorUnit = await MultiOutdoorUnit.create({ company, title, describe, imagepath, stock, price, BTU_output, working_current, condenser_unit_dimensions, quiet, wifi, timer, sabbath_command, onof_auto })
        if (multiOutdoorUnit) {
            return res.status(201).json(multiOutdoorUnit)
        }
        else {
            return res.status(400).json({ message: "MULTIOUTDOORUNIT_CREATION_FAILED" })
        }
    } catch (error) {
        console.error("Error creating MultiOutdoorUnit:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }

}

const readMultiOutdoorUnits = async (req, res) => {
    try {
        const multiOutdoorUnits = await MultiOutdoorUnit.find().populate("company").lean()
        if (!multiOutdoorUnits?.length) {
            return res.status(404).json({ message: "NO_MULTIOUTDOORUNITS_FOUND" })
        }
        return res.status(200).json(multiOutdoorUnits)
    } catch (error) {
        console.error("Error fetching multiOutdoorUnits:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMultiOutdoorUnitsByTitle = async (req, res) => {
    const { title } = req.params
    if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ message: "INVALID_TITLE" });
    }

    try {
        const multiOutdoorUnits = await MultiOutdoorUnit.find({ title: { "$regex": `^${title}`, "$options": "i" } }).populate("company").lean()
        if (!multiOutdoorUnits) {
            return res.status(404).json({ message: "NO_MULTIOUTDOORUNITS_FOUND" })
        }
        return res.status(200).json(multiOutdoorUnits)
    } catch (error) {
        console.error("Error fetching multiOutdoorUnits:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMultiOutdoorUnitById = async (req, res) => {
    const { _id } = req.params
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIOUTDOORUNIT_ID" });
    }
    try {
        const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).populate("company").lean()
        if (!multiOutdoorUnit)
            return res.status(404).json({ message: "MULTIOUTDOORUNIT_NOT_FOUND" })
        return res.status(200).json(multiOutdoorUnit)
    } catch (error) {
        console.error("Error fetching MultiOutdoorUnit by ID:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updateMultiOutdoorUnit = async (req, res) => {
    const { _id, company, title, describe, imagepath, stock, price, BTU_output, working_current, condenser_unit_dimensions, quiet, wifi, timer, sabbath_command, onof_auto } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIOUTDOORUNIT_ID" });
    }
    try {
        const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).exec()

        if (!multiOutdoorUnit) {
            return res.status(404).json({ message: "MULTIOUTDOORUNIT_NOT_FOUND" })
        }
        multiOutdoorUnit.title = title ? title : multiOutdoorUnit.title
        multiOutdoorUnit.describe = describe ? describe : multiOutdoorUnit.describe
        multiOutdoorUnit.imagepath = imagepath ? imagepath : multiOutdoorUnit.imagepath
        multiOutdoorUnit.stock = stock ? stock : multiOutdoorUnit.stock
        // multiOutdoorUnit.price= multiOutdoorUnit.price
        multiOutdoorUnit.BTU_output = BTU_output ? BTU_output : multiOutdoorUnit.BTU_output
        multiOutdoorUnit.working_current = working_current ? working_current : multiOutdoorUnit.working_current
        multiOutdoorUnit.condenser_unit_dimensions = condenser_unit_dimensions ? condenser_unit_dimensions : multiOutdoorUnit.condenser_unit_dimensions
        multiOutdoorUnit.quiet = quiet ? quiet : multiOutdoorUnit.quiet
        multiOutdoorUnit.wifi = wifi ? wifi : multiOutdoorUnit.wifi
        multiOutdoorUnit.timer = timer ? timer : multiOutdoorUnit.timer
        multiOutdoorUnit.sabbath_command = sabbath_command ? sabbath_command : multiOutdoorUnit.sabbath_command
        multiOutdoorUnit.onof_auto = onof_auto ? onof_auto : multiOutdoorUnit.onof_auto

        const updated = await multiOutdoorUnit.save()
        res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MultiOutdoorUnit:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const deleteMultiOutdoorUnit = async (req, res) => {
    const { _id } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIOUTDOORUNIT_ID" });
    }

    try {
        const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).exec()
        if (!multiOutdoorUnit) {
            return res.status(404).json({ message: "MULTIOUTDOORUNIT_NOT_FOUND" });
        }
        const result = await multiOutdoorUnit.deleteOne()
        return res.status(200).json({ message: "MULTIOUTDOORUNIT_DELETED_SUCCESSFULLY" })
    } catch (error) {
        console.error("Error deleting MultiOutdoorUnit:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updatMultiOutdoorUnitStock = async (req, res) => {
    const { _id, amount } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIOUTDOORUNIT_ID" });
    }

    if (amount === undefined || typeof amount !== "number" || amount < 0) {
        return res.status(400).json({ message: "INVALID_STOCK_AMOUNT" });
    }

    try {
        const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).populate("company").exec()
        if (!multiOutdoorUnit) {
            return res.status(404).json({ message: "MULTIOUTDOORUNIT_NOT_FOUND" });
        }

        if (multiOutdoorUnit.stock < amount) {
            return res.status(400).json({ message: "INSUFFICIENT_STOCK" });
        }
        multiOutdoorUnit.stock -= amount;
        const updated = await multiOutdoorUnit.save()
        res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MultiOutdoorUnit stock:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}


const updatMultiOutdoorUnitPrice = async (req, res) => {
    const { _id, price } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MULTIOUTDOORUNIT_ID" });
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
        return res.status(400).json({ message: "INVALID_PRICE" });
    }

    try {
    const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).populate("company").exec()
    if (!multiOutdoorUnit) {
        return res.status(404).json({ message: "MULTIOUTDOORUNIT_NOT_FOUND" });
    }
    multiOutdoorUnit.price = price
    const updated = await multiOutdoorUnit.save()
    res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MultiOutdoorUnit price:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createMultiOutdoorUnit, readMultiOutdoorUnits, readMultiOutdoorUnitsByTitle, readMultiOutdoorUnitById, updateMultiOutdoorUnit, updatMultiOutdoorUnitStock, updatMultiOutdoorUnitPrice, deleteMultiOutdoorUnit } 