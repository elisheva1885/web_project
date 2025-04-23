const Delivery = require("../models/Delivery")

const createDelivery = async (req, res) => {
    const user_id = req.user._id
    const { address, purchase, status} = req.body
    console.log( address, purchase, status)
    if (!user_id || !address.length || !purchase.length ) {
        return res.status(400).json({ message: "user_id, address and purchase are required" })
    }
    const delivery = await Delivery.create({ user_id, address, purchase, status})
    if (delivery) {
        const deliveries = await Delivery.find().lean()
        return res.status(201).json(deliveries)
    }
    else {   
        return res.status(400).json({ message: "invalid delivery" })
    }
}

const readDeliveries = async (req, res) => {
    const deliveries = await Delivery.find().lean()
    if (!deliveries?.length)
        return res.status(404).json({ message: "no deliveries found" })
    return res.status(200).json(deliveries)
}

const readDeliveriesByUserId = async (req,res) => {
    const user_id = req.user._id
    if (!user_id) {
        return res.status(400).json({ message: "user required" })
    }
    const deliveries = await Delivery.findById(user_id).lean()

    if(!deliveries)
        return res.status(404).json({ message: "no delivery for this user" })
    return res.status(200).json(deliveries)
}

const updateDelivery = async (req, res) => {
    const { _id, address, purchase, status} = req.body
    if(!_id){
        return res.status(400).json({message: "error on updating"})
    }
    if (!products) {
        return res.status(400).json({ message: "nothing changed" })
    }
    const delivery = await Delivery.findById(_id).exec()
    if (!delivery) {
        return res.status(400).json({ message: "no such delivery" })
    }
    delivery.address = address?address:delivery.address
    delivery.purchase = purchase?purchase:delivery.purchase
    delivery.status = status?status:delivery.status

    const updateddelivery = await delivery.save()
    const deliveries = await Delivery.find().lean()
    return res.status(200).json(deliveries)  
}

const deleteDelivery = async (req,res)=> {
    const {_id} = req.body
    const delivery = await Delivery.findById(_id).exec()
    if(!delivery){
        return res.status(404).json({ message: "delivery not found" })
    }
    const result = await delivery.deleteOne()
    const deliveries = await Delivery.find().lean()
    if (!deliveries?.length)
        return res.status(404).json({ message: "no deliveries found" })
    return res.status(200).json(deliveries)

}

module.exports = {createDelivery, readDeliveries, readDeliveriesByUserId, updateDelivery, deleteDelivery}