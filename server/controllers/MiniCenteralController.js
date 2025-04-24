const MiniCenteral = require("../models/airconditioners/MiniCenteral")


const createMiniCenteral = async (req, res) => {
    const {company , title, describe , imagepath , stock , price , BTU_output ,efficiency_factor, energy_rating , working_current ,CFM, Pa, pipe_connection , in_size , out_size, quiet, wifi,speeds, air4d, sabbath_command,onof_auto} = req.body
    if(!company || !title ||!describe || !price ||!imagepath ){
        return res.status(400).json({ message: "all details are required" })
    }
    const duplicate = await MiniCenteral.findOne({ title: title }).populate("company").lean()
    if (duplicate) {
        return res.status(409).json({ message: "already exist" })
    }
    const miniCenteral = await MiniCenteral.create({company , title, describe , imagepath , stock , price , BTU_output ,efficiency_factor, energy_rating , working_current ,CFM, Pa, pipe_connection , in_size , out_size, quiet, wifi,speeds, air4d, sabbath_command,onof_auto})
    if(miniCenteral){
        res.status(201).json(miniCenteral)
    }
    else{
        return  res.status(400).json({ message: "invalid miniCenteral" })
    }

}

const readMiniCenterals = async (req,res)=> {
    const miniCenterals = await MiniCenteral.find().populate("company").lean()
    if(!miniCenterals?.length){
        return res.status(404).json({ message: "no miniCenterals found" })
    }
    return res.status(200).json(miniCenterals)
}

const readMiniCenteralsByTitle = async (req,res)=> {
    const {title} = req.params
    const miniCenterals = await MiniCenteral.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    if(!miniCenterals)
        return res.status(404).json({ message: "no such miniCenterals conditioner" })
    res.status(200).json(miniCenterals)

}

const readMiniCenteralById = async (req,res)=> {
    const {_id} = req.params
    if(!_id){
        return res.status(400).json({message: "reqired"})
    }
    const miniCenteral = await MiniCenteral.findById(_id).populate("company").lean()
    if(!miniCenteral)
        return res.status(404).json({ message: "no such miniCenteral conditioner" })
    res.status(200).json(miniCenteral)
}

const updateMiniCenteral = async (req, res) => {
    const { _id,company , title, describe , imagepath , stock , price , BTU_output ,efficiency_factor, energy_rating , working_current ,CFM, Pa, pipe_connection , in_size , out_size, quiet, wifi,speeds, air4d, sabbath_command,onof_auto} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    const miniCenteral = await MiniCenteral.findById(_id).exec()

    if(!miniCenteral){
        return res.status(400).json({message: "miniCenteral not found"})
    }
    miniCenteral.title= title?title:miniCenteral.title
    miniCenteral.describe= describe?describe:miniCenteral.describe
    miniCenteral.imagepath= imagepath?imagepath:miniCenteral.imagepath
    miniCenteral.stock= stock?stock:miniCenteral.stock
    miniCenteral.price= miniCenteral.price
    miniCenteral.BTU_output= BTU_output?BTU_output:miniCenteral.BTU_output
    miniCenteral.efficiency_factor= efficiency_factor?efficiency_factor:miniCenteral.efficiency_factor
    miniCenteral.energy_rating= energy_rating?energy_rating:miniCenteral.energy_rating
    miniCenteral.working_current= working_current?working_current:miniCenteral.working_current
    miniCenteral.CFM= CFM?CFM:miniCenteral.CFM
    miniCenteral.Pa= Pa?Pa:miniCenteral.Pa
    miniCenteral.pipe_connection= pipe_connection?pipe_connection:miniCenteral.pipe_connection
    miniCenteral.in_size= in_size?in_size:miniCenteral.in_size
    miniCenteral.out_size= out_size?out_size:miniCenteral.out_size
    miniCenteral.quiet= quiet?quiet:miniCenteral.quiet
    miniCenteral.wifi= wifi?wifi:miniCenteral.wifi
    miniCenteral.speeds= speeds?speeds:miniCenteral.speeds
    miniCenteral.air4d= air4d?air4d:miniCenteral.air4d
    miniCenteral.sabbath_command= sabbath_command?sabbath_command:miniCenteral.sabbath_command
    miniCenteral.onof_auto= onof_auto?onof_auto:miniCenteral.onof_auto
    const updated = await miniCenteral.save()
    // const miniCenterals = await miniCenteral.find().populate("company").lean()
    res.status(201).json(miniCenteral)
}

const deleteMiniCenteral = async (req,res)=> {
    const {_id} = req.body
    const miniCenteral = await MiniCenteral.findById(_id).exec()
    if(!miniCenteral){
        return res.status(400).json({ message: "miniCenteral not found" })
    }
    const result = await overhead.deleteOne()
    // const overheads = await MiniCenteral.find().populate("company").lean()
    // if(!overheads?.length){
    //     return res.status(400).json({ message: "no overheads found" })
    // }
    return res.status(200).json({message:"miniCenteral deleted"})
}

const updatMiniCenteralStock = async (req,res) => {
    const { _id, amount} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!amount){
        return res.status(204).json({message: "the stock didn't change"})
    }
    const miniCenteral = await MiniCenteral.findById(_id).populate("company").exec()
    miniCenteral.stock= miniCenteral.stock- amount
    const updated = await miniCenteral.save()
    res.status(201).json(miniCenteral)
}

module.exports = {createMiniCenteral,readMiniCenterals, readMiniCenteralsByTitle, readMiniCenteralById, updateMiniCenteral, updatMiniCenteralStock , deleteMiniCenteral} 