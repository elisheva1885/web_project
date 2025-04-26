const MultiOutdoorUnit = require("../models/airconditioners/MultiOutdoorUnit")


const createMultiOutdoorUnit = async (req, res) => {
    const {company , title, describe , imagepath , stock , price , BTU_output ,working_current, condenser_unit_dimensions , quiet ,wifi, timer, sabbath_command , onof_auto } = req.body
    if(!company || !title ||!describe || !price ||!imagepath ){
        return res.status(400).json({ message: "all details are required" })
    }
    const duplicate = await MultiOutdoorUnit.findOne({ title: title }).populate("company").lean()
    if (duplicate) {
        return res.status(409).json({ message: "already exist" })
    }
    const multiOutdoorUnit = await MultiOutdoorUnit.create({company , title, describe , imagepath , stock , price , BTU_output ,working_current, condenser_unit_dimensions , quiet ,wifi, timer, sabbath_command , onof_auto})
    if(multiOutdoorUnit){
        res.status(201).json(multiOutdoorUnit)
    }
    else{
        return  res.status(400).json({ message: "invalid multiOutdoorUnit" })
    }

}

const readMultiOutdoorUnits = async (req,res)=> {
    const multiOutdoorUnits = await MultiOutdoorUnit.find().populate("company").lean()
    if(!multiOutdoorUnits?.length){
        return res.status(404).json({ message: "no multiOutdoorUnits found" })
    }
    return res.status(200).json(multiOutdoorUnits)
}

const readMultiOutdoorUnitsByTitle = async (req,res)=> {
    const {title} = req.params
    const multiOutdoorUnits = await MultiOutdoorUnit.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    if(!multiOutdoorUnits)
        return res.status(404).json({ message: "no such multiOutdoorUnits conditioner" })
    res.status(200).json(multiOutdoorUnits)

}

const readMultiOutdoorUnitById = async (req,res)=> {
    const {_id} = req.params
    if(!_id){
        return res.status(400).json({message: "reqired"})
    }
    const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).populate("company").lean()
    if(!multiOutdoorUnit)
        return res.status(404).json({ message: "no such multiOutdoorUnit conditioner" })
    res.status(200).json(multiOutdoorUnit)
}

const updateMultiOutdoorUnit = async (req, res) => {
    const { _id,company , title, describe , imagepath , stock , price , BTU_output ,working_current, condenser_unit_dimensions , quiet ,wifi, timer, sabbath_command , onof_auto} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).exec()

    if(!multiOutdoorUnit){
        return res.status(400).json({message: "multiOutdoorUnit not found"})
    }
    multiOutdoorUnit.title= title?title:multiOutdoorUnit.title
    multiOutdoorUnit.describe= describe?describe:multiOutdoorUnit.describe
    multiOutdoorUnit.imagepath= imagepath?imagepath:multiOutdoorUnit.imagepath
    multiOutdoorUnit.stock= stock?stock:multiOutdoorUnit.stock
    // multiOutdoorUnit.price= multiOutdoorUnit.price
    multiOutdoorUnit.BTU_output= BTU_output?BTU_output:multiOutdoorUnit.BTU_output
    multiOutdoorUnit.working_current= working_current?working_current:multiOutdoorUnit.working_current
    multiOutdoorUnit.condenser_unit_dimensions= condenser_unit_dimensions?condenser_unit_dimensions:multiOutdoorUnit.condenser_unit_dimensions
    multiOutdoorUnit.quiet= quiet?quiet:multiOutdoorUnit.quiet
    multiOutdoorUnit.wifi= wifi?wifi:multiOutdoorUnit.wifi
    multiOutdoorUnit.timer= timer?timer:multiOutdoorUnit.timer
    multiOutdoorUnit.sabbath_command= sabbath_command?sabbath_command:multiOutdoorUnit.sabbath_command
    multiOutdoorUnit.onof_auto= onof_auto?onof_auto:multiOutdoorUnit.onof_auto
    const updated = await multiOutdoorUnit.save()
    // const multiOutdoorUnits = await multiOutdoorUnit.find().populate("company").lean()
    res.status(200).json(multiOutdoorUnit)
}

const deleteMultiOutdoorUnit = async (req,res)=> {
    const {_id} = req.body
    const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).exec()
    if(!multiOutdoorUnit){
        return res.status(400).json({ message: "multiOutdoorUnit not found" })
    }
    const result = await multiOutdoorUnit.deleteOne()
    // const overheads = await MultiOutdoorUnit.find().populate("company").lean()
    // if(!overheads?.length){
    //     return res.status(400).json({ message: "no overheads found" })
    // }
    return res.status(200).json({message:"multiOutdoorUnit deleted"})
}

const updatMultiOutdoorUnitStock = async (req,res) => {
    const { _id, amount} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!amount){
        return res.status(204).json({message: "the stock didn't change"})
    }
    const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).populate("company").exec()
    multiOutdoorUnit.stock= multiOutdoorUnit.stock- amount
    const updated = await multiOutdoorUnit.save()
    res.status(200).json(multiOutdoorUnit)
}


const updatMultiOutdoorUnitPrice = async (req,res) => {
    const { _id, price} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!price){
        return res.status(204).json({message: "the price didn't change"})
    }
    const multiOutdoorUnit = await MultiOutdoorUnit.findById(_id).populate("company").exec()
    multiOutdoorUnit.price= price
    const updated = await multiOutdoorUnit.save()
    res.status(200).json(multiOutdoorUnit)
}

module.exports = {createMultiOutdoorUnit,readMultiOutdoorUnits, readMultiOutdoorUnitsByTitle, readMultiOutdoorUnitById, updateMultiOutdoorUnit, updatMultiOutdoorUnitStock , updatMultiOutdoorUnitPrice, deleteMultiOutdoorUnit} 