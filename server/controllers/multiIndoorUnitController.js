const MultiIndoorUnit = require("../models/airconditioners/MultiIndoorUnit")


const createMultiIndoorUnit = async (req, res) => {
    const uploadedFile = req.file;
    const otherDataString = req.body.otherData;
    if(!otherDataString){
        return res.status(400).json({ message: "all details are required" })
    }
    const otherData = JSON.parse(otherDataString);
    const {company , title, describe  , stock , price , BTU_output ,CFM, pipe_connection , evaporator_unit_dimensions } = otherData
    if(!company || !title ||!describe || !price ){
        return res.status(400).json({ message: "all details are required" })
    }
    const imagepath = req.file.filename ;
    if(!imagepath){
        return res.status(400).json({ message: "all details are required" })
    }
    const duplicate = await MultiIndoorUnit.findOne({ title: title }).populate("company").lean()
    if (duplicate) {
        return res.status(409).json({ message: "already exist" })
    }
    const multiIndoorUnit = await MultiIndoorUnit.create({company , title, describe , imagepath , stock , price , BTU_output ,CFM, pipe_connection , evaporator_unit_dimensions})
    if(multiIndoorUnit){
        return res.status(201).json(multiIndoorUnit)
    }
    
        return res.status(400).json({ message: "invalid multiIndoorUnit" })

}

const readMultiIndoorUnits = async (req,res)=> {
    const multiIndoorUnits = await MultiIndoorUnit.find().populate("company").lean()
    if(!multiIndoorUnits?.length){
        return res.status(404).json({ message: "no multiIndoorUnits found" })
    }
    return res.status(200).json(multiIndoorUnits)
}

const readMultiIndoorUnitsByTitle = async (req,res)=> {
    const {title} = req.params
    const multiIndoorUnits = await MultiIndoorUnit.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    if(!multiIndoorUnits)
        return res.status(404).json({ message: "no such multiIndoorUnits conditioner" })
    return res.status(200).json(multiIndoorUnits)

}

const readMultiIndoorUnitById = async (req,res)=> {
    const {_id} = req.params
    if(!_id){
        return res.status(400).json({message: "reqired"})
    }
    const multiIndoorUnit = await MultiIndoorUnit.findById(_id).populate("company").lean()
    if(!multiIndoorUnit)
        return res.status(404).json({ message: "no such multiIndoorUnit conditioner" })
    return res.status(200).json(multiIndoorUnit)
}

const updateMultiIndoorUnit = async (req, res) => {
    const { _id,company , title, describe , imagepath , stock , price , BTU_output ,CFM, pipe_connection , evaporator_unit_dimensions} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    const multiIndoorUnit = await MultiIndoorUnit.findById(_id).exec()

    if(!multiIndoorUnit){
        return res.status(400).json({message: "multiIndoorUnit not found"})
    }
    multiIndoorUnit.title= title?title:multiIndoorUnit.title
    multiIndoorUnit.describe= describe?describe:multiIndoorUnit.describe
    multiIndoorUnit.imagepath= imagepath?imagepath:multiIndoorUnit.imagepath
    multiIndoorUnit.stock= stock?stock:multiIndoorUnit.stock
    // multiIndoorUnit.price= multiIndoorUnit.price
    multiIndoorUnit.BTU_output= BTU_output?BTU_output:multiIndoorUnit.BTU_output
    multiIndoorUnit.CFM= CFM?CFM:multiIndoorUnit.CFM
    multiIndoorUnit.pipe_connection= pipe_connection?pipe_connection:multiIndoorUnit.pipe_connection
    multiIndoorUnit.evaporator_unit_dimensions= evaporator_unit_dimensions?evaporator_unit_dimensions:multiIndoorUnit.evaporator_unit_dimensions
    const updated = await multiIndoorUnit.save()
    // const multiIndoorUnits = await multiIndoorUnit.find().populate("company").lean()
    return res.status(200).json(multiIndoorUnit)
}

const deleteMultiIndoorUnit = async (req,res)=> {
    const {_id} = req.body
    const multiIndoorUnit = await MultiIndoorUnit.findById(_id).exec()
    if(!multiIndoorUnit){
        return res.status(400).json({ message: "multiIndoorUnit not found" })
    }
    const result = await multiIndoorUnit.deleteOne()
    // const overheads = await MultiIndoorUnit.find().populate("company").lean()
    // if(!overheads?.length){
    //     return res.status(400).json({ message: "no overheads found" })
    // }
    return res.status(200).json({message:"multiIndoorUnit deleted"})
}

const updatMultiIndoorUnitStock = async (req,res) => {
    const { _id, amount} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!amount){
        return res.status(204).json({message: "the stock didn't change"})
    }
    const multiIndoorUnit = await MultiIndoorUnit.findById(_id).populate("company").exec()
    multiIndoorUnit.stock= multiIndoorUnit.stock- amount
    const updated = await multiIndoorUnit.save()
    return res.status(200).json(multiIndoorUnit)
}


const updatMultiIndoorUnitPrice = async (req,res) => {
    const { _id, price} = req.body
    console.log(_id);
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!price){
        return res.status(204).json({message: "the price didn't change"})
    }
    const multiIndoorUnit = await MultiIndoorUnit.findById(_id).populate("company").exec()
    if(!multiIndoorUnit){
        return res.status(404).json({ message: "no such multiIndoorUnit conditioner" })
    }
    console.log(multiIndoorUnit);
    multiIndoorUnit.price= price
    const updated = await multiIndoorUnit.save()
    return res.status(200).json(multiIndoorUnit)
}

module.exports = {createMultiIndoorUnit,readMultiIndoorUnits, readMultiIndoorUnitsByTitle, readMultiIndoorUnitById, updateMultiIndoorUnit, updatMultiIndoorUnitStock , updatMultiIndoorUnitPrice, deleteMultiIndoorUnit} 