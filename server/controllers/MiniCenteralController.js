const MiniCenteral = require("../models/airconditioners/MiniCenteral")

const createMiniCenteral = async (req, res) => {
    const uploadedFile = req.file;
    const otherDataString = req.body.otherData;
    if (!uploadedFile || !uploadedFile.filename) {
        return res.status(400).json({ message: "INVALID_IMAGE" });
    }
    if (!otherDataString) {
        return res.status(400).json({ message: "INVALID_OTHER_DATA" });
    }
    let otherData;
    try {
        otherData = JSON.parse(otherDataString);
    } catch (error) {
        return res.status(400).json({ message: "INVALID_OTHER_DATA_FORMAT" });
    }
    const {
        company, title, describe, stock, price,
        BTU_output, efficiency_factor, energy_rating,
        working_current, CFM, Pa, pipe_connection,
        in_size, out_size, quiet, wifi, speeds,
        air4d, sabbath_command, onof_auto
    } = otherData;

    if (!company || !title || !describe || !price) {
        return res.status(400).json({ message: "REQUIRED_FIELDS_MISSING" })
    }
    const imagepath = req.file.filename;
    if (!imagepath) {
        return res.status(400).json({ message: "REQUIRED_FIELDS_MISSING" })
    }
    try {
        const duplicate = await MiniCenteral.findOne({ title: title }).populate("company").lean()
        if (duplicate) {
            return res.status(409).json({ message: "MINICENTERAL_ALREADY_EXISTS" })
        }
        const miniCenteral = await MiniCenteral.create({ company, title, describe, imagepath, stock, price, BTU_output, efficiency_factor, energy_rating, working_current, CFM, Pa, pipe_connection, in_size, out_size, quiet, wifi, speeds, air4d, sabbath_command, onof_auto })
        if (miniCenteral) {
            return res.status(201).json(miniCenteral);
        } else {
            return res.status(400).json({ message: "MINICENTERAL_CREATION_FAILED" });
        }
    } catch (error) {
        console.error("Error creating MiniCenteral:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}


const readMiniCenterals = async (req, res) => {
    try {
        const miniCenterals = await MiniCenteral.find().populate("company").lean()
        if (!miniCenterals?.length) {
            return res.status(404).json({ message: "NO_MINICENTERALS_FOUND" })
        }
        return res.status(200).json(miniCenterals)
    } catch (error) {
        console.error("Error fetching MiniCenterals:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMiniCenteralsByTitle = async (req, res) => {
    const { title } = req.params
    if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ message: "INVALID_TITLE" });
    }

    try {
        const miniCenterals = await MiniCenteral.find({ title: { "$regex": `^${title}`, "$options": "i" } }).populate("company").lean()
        if (!miniCenterals?.length) {
            return res.status(404).json({ message: "NO_MINICENTERALS_FOUND" });
        }
        res.status(200).json(miniCenterals)
    } catch (error) {
        console.error("Error fetching MiniCenterals by title:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readMiniCenteralById = async (req, res) => {
    const { _id } = req.params
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MINICENTERAL_ID" });
    }
    try {
        const miniCenteral = await MiniCenteral.findById(_id).populate("company").lean()
        if (!miniCenteral)
            return res.status(404).json({ message: "MINICENTERAL_NOT_FOUND" })
        // console.log(miniCenteral);
        return res.status(200).json(miniCenteral)
    } catch (error) {
        console.error("Error fetching MiniCenteral by ID:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updateMiniCenteral = async (req, res) => {
    const { _id, title, describe, stock, BTU_output, efficiency_factor, energy_rating, working_current, CFM, Pa, pipe_connection, in_size, out_size, quiet, wifi, speeds, air4d, sabbath_command, onof_auto } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MINICENTERAL_ID" });
    }
    try {
        const miniCenteral = await MiniCenteral.findById(_id).exec()
        if (!miniCenteral) {
            return res.status(404).json({ message: "MINICENTERAL_NOT_FOUND" })
        }

        miniCenteral.title = title ? title : miniCenteral.title
        miniCenteral.describe = describe ? describe : miniCenteral.describe
        miniCenteral.stock = stock ? stock : miniCenteral.stock
        miniCenteral.BTU_output = BTU_output ? BTU_output : miniCenteral.BTU_output
        miniCenteral.efficiency_factor = efficiency_factor ? efficiency_factor : miniCenteral.efficiency_factor
        miniCenteral.energy_rating = energy_rating ? energy_rating : miniCenteral.energy_rating
        miniCenteral.working_current = working_current ? working_current : miniCenteral.working_current
        miniCenteral.CFM = CFM ? CFM : miniCenteral.CFM
        miniCenteral.Pa = Pa ? Pa : miniCenteral.Pa
        miniCenteral.pipe_connection = pipe_connection ? pipe_connection : miniCenteral.pipe_connection
        miniCenteral.in_size = in_size ? in_size : miniCenteral.in_size
        miniCenteral.out_size = out_size ? out_size : miniCenteral.out_size
        miniCenteral.quiet = quiet ? quiet : miniCenteral.quiet
        miniCenteral.wifi = wifi ? wifi : miniCenteral.wifi
        miniCenteral.speeds = speeds ? speeds : miniCenteral.speeds
        miniCenteral.air4d = air4d ? air4d : miniCenteral.air4d
        miniCenteral.sabbath_command = sabbath_command ? sabbath_command : miniCenteral.sabbath_command
        miniCenteral.onof_auto = onof_auto ? onof_auto : miniCenteral.onof_auto
        const updated = await miniCenteral.save()
        res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MiniCenteral:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const deleteMiniCenteral = async (req, res) => {
    const { _id } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MINICENTERAL_ID" });
    }
    try {
        const miniCenteral = await MiniCenteral.findById(_id).exec()
        if (!miniCenteral) {
            return res.status(404).json({ message: "MINICENTERAL_NOT_FOUND" })
        }
        const result = await miniCenteral.deleteOne()
        return res.status(200).json({ message: "MINICENTERAL_DELETED_SUCCESSFULLY" })
    } catch (error) {
        console.error("Error deleting MiniCenteral:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updatMiniCenteralStock = async (req, res) => {
    const { _id, amount } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MINICENTERAL_ID" });
    }

    if (amount === undefined || typeof amount !== "number" || amount < 0) {
        return res.status(400).json({ message: "INVALID_STOCK_AMOUNT" });
    }
    try {
        const miniCenteral = await MiniCenteral.find({ _id: _id }).populate("company").exec()
        if (!miniCenteral) {
            return res.status(404).json({ message: "MINICENTERAL_NOT_FOUND" });
        }
        if (miniCenteral.stock < amount) {
            return res.status(400).json({ message: "INSUFFICIENT_STOCK" });
        }
        miniCenteral.stock = miniCenteral.stock - amount
        const updated = await miniCenteral.save()
        res.status(200).json(miniCenteral)
    } catch (error) {
        console.error("Error updating MiniCenteral stock:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}


const updatMiniCenteralPrice = async (req, res) => {
    const { _id, price } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_MINICENTERAL_ID" });
    }

    if (price === undefined || price <= 0) {
        return res.status(400).json({ message: "INVALID_PRICE" });
    }
    try {
        const miniCenteral = await MiniCenteral.findById(_id).populate("company").exec()
        if (!miniCenteral) {
            return res.status(404).json({ message: "MINICENTERAL_NOT_FOUND" });
        }
        miniCenteral.price = price
        const updated = await miniCenteral.save()
        res.status(200).json(updated)
    } catch (error) {
        console.error("Error updating MiniCenteral price:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createMiniCenteral, readMiniCenterals, readMiniCenteralsByTitle, readMiniCenteralById, updateMiniCenteral, deleteMiniCenteral, updatMiniCenteralPrice, updatMiniCenteralStock } 