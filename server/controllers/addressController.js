const Address = require("../models/Address")

const createAddress = async (req, res) => {
    const user_id = req.user._id
    const { country, city, street, building_num, apartment_num, floor, zip_code} = req.body
    if (!user_id || !country || !city || !street || !building_num || !apartment_num || !floor || !zip_code) {
        return res.status(400).json({ message: "all details are required" })
    }
    const address = await Address.create({ user_id, country, city, street, building_num, apartment_num, floor, zip_code})
    if (address) {
        const addresses = await Address.find().lean()
        return res.status(201).json(addresses)
    }
    else {   
        return res.status(400).json({ message: "invalid address" })
    }
}

const readAddresses = async (req, res) => {
    const addresses = await Address.find().lean()
    if (!addresses?.length)
        return res.status(404).json({ message: "no addresses found" })
    return res.status(200).json(addresses)
}

const readAddressesByUserId = async (req,res) => {
    const user_id = req.user._id
    const addresses = await Address.findById(user_id).lean()

    if(!addresses)
        return res.status(404).json({ message: "no address for this user" })
    return res.status(200).json(addresses)
}

const updateAddress = async (req, res) => {
    const { _id, country, city, street, building_num, apartment_num, floor, zip_code } = req.body
    if(!_id){
        return res.status(400).json({message: "error on updating"})
    }
    if (!country && !city && !street && !building_num && !apartment_num && !floor && !zip_code) {
        return res.status(400).json({ message: "nothing changed" })
    }
    const address = await Address.findById(_id).exec()
    if (!address) {
        return res.status(400).json({ message: "no such address" })
    }
    address.country = country?country:address.country
    address.city = city?city:address.city
    address.street = street?street:address.street
    address.building_num = building_num?building_num:address.building_num
    address.apartment_num = apartment_num?apartment_num:address.apartment_num
    address.floor = floor?floor:address.floor
    address.zip_code = zip_code?zip_code:address.zip_code

    const updatedAddress = await address.save()
    const addresses = await Address.find().lean()
    return res.status(200).json(addresses)  
}

const deleteAddress = async (req,res)=> {
    const {_id} = req.body
    const address = await Address.findById(_id).exec()
    if(!address){
        return res.status(404).json({ message: "address not found" })
    }
    const result = await address.deleteOne()
    const addresses = await Address.find().lean()
    if (!addresses?.length)
        return res.status(404).json({ message: "no addresses found" })
    return res.status(200).json(addresses)

}

module.exports = { createAddress, readAddresses, readAddressesByUserId, updateAddress, deleteAddress}