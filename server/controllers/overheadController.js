const Overhead = require("../models/airconditioners/Overhead")

const createOverhead = async (req, res) => {
    const uploadedFile = req.file;
    const otherDataString = req.body.otherData;
    if(!otherDataString){
        return res.status(400).json({ message: "all details are required" })
    }
    const otherData = JSON.parse(otherDataString);
    const {company , title, describe  , stock , price , BTU_output , energy_rating  , working_current ,CFM, recommended_model_C, pipe_connection , in_size , out_size, air_flow, quiet, wifi,speeds, air4d,night_mode,timer, sabbath_command,onof_auto} = otherData
    if(!company || !title ||!describe || !price ){
        return res.status(400).json({ message: "all details are required" })
    }
    const imagepath = req.file.filename ;
    if(!imagepath){
        return res.status(400).json({ message: "all details are required" })
    }
    const duplicate = await Overhead.findOne({ title: title }).populate("company").lean()
    if (duplicate) {
        return res.status(409).json({ message: "already exist" })
    }
    const overhead = await Overhead.create({company , title, describe , imagepath , stock , price , BTU_output , energy_rating  , working_current ,CFM, recommended_model_C, pipe_connection , in_size , out_size, air_flow, quiet, wifi,speeds, air4d,night_mode,timer, sabbath_command,onof_auto})
    if(overhead){
        // const overheads = await Overhead.find().populate("company").lean()
        res.status(201).json(overhead)
    }
    else{
        return  res.status(400).json({ message: "invalid overhead" })
    }

}
const readOverheads = async (req,res)=> {
    const overheads = await Overhead.find().populate("company").lean()
    if(!overheads?.length){
        return res.status(404).json({ message: "no overheads found" })
    }
    return res.status(200).json(overheads)
}

const readOverheadByTitle = async (req,res)=> {
    const {title} = req.params
    const overheads = await Overhead.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    // const overheads = await Overhead.find({title:{"$regex":title, "$options": "i"}}).lean()
    if(!overheads)
        return res.status(404).json({ message: "no such overhead conditioner" })
    res.status(200).json(overheads)

}

const readOverheadById = async (req,res)=> {
    const {_id} = req.params
    if(!_id){
        return res.status(400).json({message: "reqired"})
    }
    const overhead = await Overhead.findById(_id).populate("company").lean()
   // const overheads = await Overhead.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    // const overheads = await Overhead.find({title:{"$regex":title, "$options": "i"}}).lean()
    if(!overhead)
        return res.status(404).json({ message: "no such overhead conditioner" })
    res.status(200).json(overhead)
}

const updateOverhead = async (req, res) => {
    const { _id,company , title, describe , imagepath , stock , price , BTU_output , energy_rating  , working_current ,CFM, recommended_model_C, pipe_connection , in_size , out_size, air_flow, quiet, wifi,speeds, air4d,night_mode,timer, sabbath_command,onof_auto} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    const overhead = await Overhead.findById(_id).exec()
    if(!overhead){
        return res.status(400).json({message: "overhead not found"})
    }
    overhead.title= title?title:overhead.title
    overhead.describe= describe?describe:overhead.describe
    overhead.imagepath= imagepath?imagepath:overhead.imagepath
    overhead.stock= stock?stock:overhead.stock
    // overhead.price= overhead.price
    overhead.BTU_output= BTU_output?BTU_output:overhead.BTU_output
    overhead.energy_rating= energy_rating?energy_rating:overhead.energy_rating
    overhead.working_current= working_current?working_current:overhead.working_current
    overhead.CFM= CFM?CFM:overhead.CFM
    overhead.recommended_model_C= recommended_model_C?recommended_model_C:overhead.recommended_model_C
    overhead.pipe_connection= pipe_connection?pipe_connection:overhead.pipe_connection
    overhead.in_size= in_size?in_size:overhead.in_size
    overhead.out_size= out_size?out_size:overhead.out_size
    overhead.air_flow= air_flow?air_flow:overhead.air_flow
    overhead.quiet= quiet?quiet:overhead.quiet
    overhead.wifi= wifi?wifi:overhead.wifi
    overhead.speeds= speeds?speeds:overhead.speeds
    overhead.air4d= air4d?air4d:overhead.air4d
    overhead.night_mode= night_mode?night_mode:overhead.night_mode
    overhead.timer= timer?timer:overhead.timer
    overhead.sabbath_command= sabbath_command?sabbath_command:overhead.sabbath_command
    overhead.onof_auto= onof_auto?onof_auto:overhead.onof_auto
    const updated = await overhead.save()
    res.status(200).json(overhead)
}

const updateOverheadStock = async (req,res) => {

    console.log("in the function");
    const { _id, amount} = req.body
    console.log( "the DB of the function ",_id, amount);

    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!amount){
        return res.status(204).json({message: "the stock didn't change"})
    }
    const overhead = await Overhead.find({_id:_id}).populate("company").exec()
    overhead.stock= overhead.stock- amount
    const updated = await overhead.save()
    res.status(200).json(overhead)
}

const updatOverheadPrice = async (req,res) => {
    const { _id, price} = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    if(!price){
        return res.status(204).json({message: "the price didn't change"})
    }
    const overhead = await Overhead.findById(_id).populate("company").exec()
    overhead.price= price
    const updated = await overhead.save()
    res.status(200).json(overhead)
}

const deleteOverhead = async (req,res)=> {
    const {_id} = req.body
    const overhead = await Overhead.findById(_id).exec()
    if(!overhead){
        return res.status(400).json({ message: "overhead not found" })
    }
    const result = await overhead.deleteOne()
    const overheads = await Overhead.find().populate("company").lean()
    if(!overheads?.length){
        return res.status(400).json({ message: "no overheads found" })
    }
    // return res.status(200).json(overheads)
    return res.status(200).json({message:"overhead deleted"})

}

module.exports = {createOverhead , readOverheads, readOverheadById,readOverheadByTitle , updateOverhead , updateOverheadStock,updatOverheadPrice, deleteOverhead}