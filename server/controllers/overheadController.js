const Overhead = require("../models/airconditioners/Overhead")

const createOverhead = async (req, res) => {
    const {SKU , company , title, describe , imagepath , stock , price , output , size , speeds , swing, timer , sabbath_command , night_mode } = req.body
    if(!SKU || !company || !title ||!describe || !price ||!imagepath ){
        return res.status(400).json({ message: "all details are required" })
    }
    const duplicate = await Overhead.findOne({ SKU: SKU }).populate("company").lean()
    if (duplicate) {
        return res.status(409).json({ message: "SKU already exist" })
    }
    const overhead = await Overhead.create({SKU , company , title, describe , imagepath , stock ,price, output, size,speeds, swing, timer , sabbath_command , night_mode})
    if(overhead){
        const overheads = await Overhead.find().populate("company").lean()
        res.status(200).json(overheads)
    }
    else{
        return  res.status(400).json({ message: "invalid overhead" })
    }

}
const readOverhead = async (req,res)=> {
    const overheads = await Overhead.find().populate("company").lean()
    if(!overheads?.length){
        return res.status(400).json({ message: "no overheads found" })
    }
    return res.status(200).json(overheads)
}

const readOverheadByTitle = async (req,res)=> {
    const {title} = req.params
    const overheads = await Overhead.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    // const overheads = await Overhead.find({title:{"$regex":title, "$options": "i"}}).lean()
    if(!overheads)
        return res.status(400).json({ message: "no such overhead conditioner" })
    res.status(200).json(overheads)

}

const readOverheadById = async (req,res)=> {
    const {_id} = req.params
    const overhead = await Overhead.findById(_id).populate("company").lean()
   // const overheads = await Overhead.find({title:{"$regex":`^${title}`, "$options": "i"}}).populate("company").lean()
    // const overheads = await Overhead.find({title:{"$regex":title, "$options": "i"}}).lean()
    if(!overhead)
        return res.status(400).json({ message: "no such overhead conditioner" })
    res.status(200).json(overhead)
}

const updateOverhead = async (req, res) => {
    const { _id,title, describe , imagepath , stock, output, size,speeds, swing, timer , sabbath_command , night_mode } = req.body
    if(!_id){
        return res.status(400).json({message: "all details are required"})
    }
    const overhead = await Overhead.findById(_id).exec()
    overhead.title= title?title:overhead.title
    overhead.describe= describe?describe:overhead.describe
    overhead.imagepath= imagepath?imagepath:overhead.imagepath
    overhead.stock= stock?stock:overhead.stock
    overhead.price= overhead.price
    overhead.output= output?output:overhead.output
    overhead.size= size?size:overhead.size
    overhead.speeds= speeds?speeds:overhead.speeds
    overhead.swing= swing?swing:overhead.swing
    overhead.timer= timer?timer:overhead.timer
    overhead.sabbath_command= sabbath_command?sabbath_command:overhead.sabbath_command
    overhead.night_mode= night_mode?night_mode:overhead.night_mode
    const updated = await overhead.save()
    const overheads = await Overhead.find().populate("company").lean()
    res.status(200).json(overheads)
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
    return res.status(200).json(overheads)
}

module.exports = {createOverhead , readOverhead, readOverheadById,readOverheadByTitle , updateOverhead , deleteOverhead}