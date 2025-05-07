const Overhead = require("../models/airconditioners/Overhead")

const createOverhead = async (req, res) => {
    const uploadedFile = req.file;
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
    const { company, title, describe, stock, price, BTU_output, energy_rating, working_current, CFM, recommended_model_C, pipe_connection, in_size, out_size, air_flow, quiet, wifi, speeds, air4d, night_mode, timer, sabbath_command, onof_auto } = otherData

    if (!company || !title || !describe || !price || price <= 0) {
        return res.status(400).json({ message: "REQUIRED_FIELDS_MISSING" });
    }
    const imagepath = uploadedFile?.filename;
    if (!imagepath) {
        return res.status(400).json({ message: "INVALID_IMAGE" })
    }
    try {
        const duplicate = await Overhead.findOne({ title: title }).populate("company").lean()
        if (duplicate) {
            return res.status(409).json({ message: "OVERHEAD_ALREADY_EXISTS" })
        }
        const overhead = await Overhead.create({ company, title, describe, imagepath, stock, price, BTU_output, energy_rating, working_current, CFM, recommended_model_C, pipe_connection, in_size, out_size, air_flow, quiet, wifi, speeds, air4d, night_mode, timer, sabbath_command, onof_auto })
        if (overhead) {
            return res.status(201).json(overhead)
        }
        else {
            return res.status(400).json({ message: "OVERHEAD_CREATION_FAILED" })
        }
    } catch (error) {
        console.error("Error creating overhead:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}
const readOverheads = async (req, res) => {
    try {
        const overheads = await Overhead.find().populate("company").lean()
        if (!overheads?.length) {
            return res.status(404).json({ message: "NO_OVERHEADS_FOUND" })
        }
        return res.status(200).json(overheads)
    } catch (error) {
        console.error("Error fetching overheads:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readOverheadByTitle = async (req, res) => {
    const { title } = req.params
    if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ message: "INVALID_TITLE" });
    }

    try {
        const overheads = await Overhead.find({ title: { "$regex": `^${title}`, "$options": "i" } }).populate("company").lean()
        if (!overheads?.length)
            return res.status(404).json({ message: "NO_OVERHEADS_FOUND" })
        res.status(200).json(overheads)
    } catch (error) {
        console.error("Error fetching overheads:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readOverheadById = async (req, res) => {
    const { _id } = req.params
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_OVERHEAD_ID" });
    }

    try {
        const overhead = await Overhead.findById(_id).populate("company").lean()
        if (!overhead)
            return res.status(404).json({ message: "OVERHEAD_NOT_FOUND" })
        return res.status(200).json(overhead)
    } catch (error) {
        console.error("Error fetching overhead by ID:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updateOverhead = async (req, res) => {
    const { _id, company, title, describe, imagepath, stock, price, BTU_output, energy_rating, working_current, CFM, recommended_model_C, pipe_connection, in_size, out_size, air_flow, quiet, wifi, speeds, air4d, night_mode, timer, sabbath_command, onof_auto } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_OVERHEAD_ID" });
    }

    try {
        const overhead = await Overhead.findById(_id).exec()
        if (!overhead) {
            return res.status(400).json({ message: "OVERHEAD_NOT_FOUND" })
        }
        overhead.title = title ? title : overhead.title
        overhead.describe = describe ? describe : overhead.describe
        overhead.imagepath = imagepath ? imagepath : overhead.imagepath
        overhead.stock = stock ? stock : overhead.stock
        // overhead.price= overhead.price
        overhead.BTU_output = BTU_output ? BTU_output : overhead.BTU_output
        overhead.energy_rating = energy_rating ? energy_rating : overhead.energy_rating
        overhead.working_current = working_current ? working_current : overhead.working_current
        overhead.CFM = CFM ? CFM : overhead.CFM
        overhead.recommended_model_C = recommended_model_C ? recommended_model_C : overhead.recommended_model_C
        overhead.pipe_connection = pipe_connection ? pipe_connection : overhead.pipe_connection
        overhead.in_size = in_size ? in_size : overhead.in_size
        overhead.out_size = out_size ? out_size : overhead.out_size
        overhead.air_flow = air_flow ? air_flow : overhead.air_flow
        overhead.quiet = quiet ? quiet : overhead.quiet
        overhead.wifi = wifi ? wifi : overhead.wifi
        overhead.speeds = speeds ? speeds : overhead.speeds
        overhead.air4d = air4d ? air4d : overhead.air4d
        overhead.night_mode = night_mode ? night_mode : overhead.night_mode
        overhead.timer = timer ? timer : overhead.timer
        overhead.sabbath_command = sabbath_command ? sabbath_command : overhead.sabbath_command
        overhead.onof_auto = onof_auto ? onof_auto : overhead.onof_auto
        const updated = await overhead.save()
        res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating overhead:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updateOverheadStock = async (req, res) => {
    const { _id, amount } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_OVERHEAD_ID" });
    }
    if (amount === undefined || typeof amount !== "number" || amount < 0) {
        return res.status(400).json({ message: "INVALID_STOCK_AMOUNT" });
    }
    try {
        const overhead = await Overhead.find({ _id: _id }).populate("company").exec()
        if (!overhead) {
            return res.status(404).json({ message: "OVERHEAD_NOT_FOUND" });
        }

        if (overhead.stock < amount) {
            return res.status(400).json({ message: "INSUFFICIENT_STOCK" });
        }
        overhead.stock = overhead.stock - amount;
        const updated = await overhead.save()
        return res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating overhead stock:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updatOverheadPrice = async (req, res) => {
    const { _id, price } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_OVERHEAD_ID" });
    }

    if (price === undefined || price <= 0) {
        return res.status(400).json({ message: "INVALID_PRICE" });
    }
    try {
        const overhead = await Overhead.findById(_id).populate("company").exec()
        if (!overhead) {
            return res.status(404).json({ message: "OVERHEAD_NOT_FOUND" });
        }
        overhead.price = price
        const updated = await overhead.save()
        res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating overhead price:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const deleteOverhead = async (req, res) => {
    const { _id } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_OVERHEAD_ID" });
    }

    try {
        const overhead = await Overhead.findById(_id).exec()
        if (!overhead) {
            return res.status(404).json({ message: "OVERHEAD_NOT_FOUND" })
        }
        const result = await overhead.deleteOne()
        return res.status(200).json({ message: "OVERHEAD_DELETED_SUCCESSFULLY" });
    } catch (error) {
        console.error("Error deleting overhead:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createOverhead, readOverheads, readOverheadById, readOverheadByTitle, updateOverhead, updateOverheadStock, updatOverheadPrice, deleteOverhead }