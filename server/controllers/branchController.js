const Branch = require("../models/Branch")

const createBranch = async (req, res) => {
    console.log("inside")
    const { address, phoneNumber, openingHour, closingHour} = req.body
    if (!address || !phoneNumber || !openingHour || !closingHour) {
        return res.status(400).json({ message: "all details are required" })
    }
    const branch = await Branch.create({ address, phoneNumber, openingHour, closingHour})
    if (branch) {
        const branches = await Branch.find().lean()
        return res.status(201).json(branches)
    }
    else {   
        return res.status(400).json({ message: "invalid branch" })
    }
}

const readBranch = async (req, res) => {
    const branches = await Branch.find().lean()
    if (!branches?.length)
        return res.status(404).json({ message: "no branches found" })
    return res.status(200).json(branches)
}

const readBranchByCity = async (req,res) => {
    const {city} = req.params
    const branches = await Branch.find({"address.city":{"$regex":`^${city}`, "$options": "i"}}).lean()

    if(!branches)
        return res.status(404).json({ message: "no branch in this city" })
    return res.status(200).json(branches)
}

const updateBranch = async (req, res) => {
    const { _id,address, phoneNumber, openingHour, closingHour } = req.body
    if(!_id){
        return res.status(400).json({message: "error on updating"})
    }
    if (!address && !phoneNumber && !openingHour && !closingHour) {
        return res.status(400).json({ message: "nothing changed" })
    }
    const branch = await Branch.findById(_id).exec()
    if (!branch) {
        return res.status(400).json({ message: "no such branch" })
    }
    branch.address.city = address.city?address.city:branch.address.city
    branch.address.street = address.street?address.street:branch.address.street
    branch.address.streetNum = address.streetNum?address.streetNum:branch.address.streetNum
    branch.phoneNumber = phoneNumber?phoneNumber:branch.phoneNumber
    branch.openingHour = openingHour?openingHour:branch.openingHour
    branch.closingHour.weekdays = closingHour.weekdays?closingHour.weekdays:branch.closingHour.weekdays
    branch.closingHour.fridays = closingHour.fridays?closingHour.fridays:branch.closingHour.fridays
    const updatedBranch = await branch.save()
    const branches = await Branch.find().lean()
    return res.status(201).json(branches)  
    // return res.status(201).json({message: "updated"})  

}

const deleteBranch = async (req,res)=> {
    const {_id} = req.body
    const branch = await Branch.findById(_id).exec()
    if(!branch){
        return res.status(404).json({ message: "branch not found" })
    }
    const result = await branch.deleteOne()
    const branches = await Branch.find().lean()
    if (!branches?.length)
        return res.status(404).json({ message: "no branches found" })
    return res.status(200).json(branches)

}

module.exports = { createBranch, readBranch, readBranchByCity, updateBranch, deleteBranch}