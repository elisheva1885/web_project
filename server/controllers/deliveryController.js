const Delivery = require("../models/Delivery")
const User = require("../models/User")
const Address = require("../models/Address")
const Purchase = require("../models/Purchase")

const createDelivery = async (req, res) => {
    const user_id = req.user._id
    const { address, purchase, status} = req.body
    console.log("createDelivery", address, purchase, status)
    // if (!user_id || !address || !purchase.length ) {
    if (!user_id || !address || !purchase ) {
        return res.status(400).json({ message: "user_id, address and purchase are required" })
    }
    const delivery=null;
    if (!status){
        delivery = await Delivery.create({ user_id, address, purchases})
    }
    else{
        delivery = await Delivery.create({ user_id, address, purchases, status})
    }
    if (delivery) {
        // const deliveries = await Delivery.find().lean()
        // console.log("createDelivery")
        return res.status(201).json(delivery)
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

// const readDeliveriesByUserId = async (req,res) => {
//     const user_id = req.user._id
//     if (!user_id) {
//         return res.status(400).json({ message: "user required" })
//     }
//     const deliveries = await Delivery.findById(user_id).lean()

//     if(!deliveries)
//         return res.status(404).json({ message: "no delivery for this user" })
//     return res.status(200).json(deliveries)
// }

const readDeliveriesByUserName = async (req,res) => {
    const {username} = req.params
    console.log("username ",username)
    if (!username) {
        return res.status(400).json({ message: "user required" })
    }
    const user = await User.findOne({ username: username });
    console.log("user ",user)
    if (!user) {
        return res.status(401).json({ message: "user anauthorized" })
    }
    const deliveries = await Delivery.find({ user_id: user._id }).populate('address').populate('purchases').lean()
    if(!deliveries)
        return res.status(404).json({ message: "no deliveries for this user" })
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
    if(status === "waiting to be delivered"){
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
    return res.status(404).json({message: "unable to update" })
      
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

module.exports = {createDelivery, readDeliveries, readDeliveriesByUserName, updateDelivery, deleteDelivery}