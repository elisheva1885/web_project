const Company = require("../models/airconditioners/Company")

const createCompany = async (req, res) => {
    const name = req.body.name;
    if(!name){
        return res.status(400).json({ message: "all details are required" })
    }
    const imagepath = req.file.filename ;
    if(!imagepath){
        return res.status(400).json({ message: "all details are required" })
    }

    const duplicate = await Company.findOne({ name: name }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "name already exist" })
    }
    const company = await Company.create({name, imagePath: imagepath })

    if(company){
        res.status(201).json(company)
    }
    else{
        return  res.status(400).json({ message: "invalid company" })
    }

}


const readCompany = async (req,res)=> {
    const companies = await Company.find().lean()
    if(!companies?.length){
        return res.status(404).json({ message: "no companies found" })
    }
    return res.status(200).json(companies)
}

const readCompanyByName = async (req,res)=> {
    const {name} = req.params
    console.log(name);
    const company = await Company.findOne({name: name}).lean()
    console.log(company);
    if(!company)
        return res.status(404).json({ message: "no such company" })
    res.status(200).json(company)
}



const deleteCompany = async (req,res)=> {
    const {_id} = req.body
    const company = await Company.findById(_id).exec()
    if(!company){
        return res.status(400).json({ message: "company not found" })
    }
    const result = await company.deleteOne()
    const companies = await Company.find().lean()
    if(!companies?.length){
        return res.status(404).json({ message: "no companies found" })
    }
    return res.status(200).json(companies)
}

module.exports = {createCompany , readCompany  , deleteCompany , readCompanyByName}