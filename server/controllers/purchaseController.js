const Purchase = require("../models/Purchase")

const createPurchase = async (req, res) => {
    const user_id = req.user._id
    const { products , paymentType} = req.body
    if (!user_id || !products || paymentType) {
        return res.status(400).json({ message: "all details are required" })
    }
    const purchase = await Purchase.create({ user_id, products,paymentType})
    if (purchase) {
        const purchases = await Purchase.find().lean()
        return res.status(201).json(purchases)
    }
    else {   
        return res.status(400).json({ message: "invalid purchase" })
    }
}

const readPurchases = async (req, res) => {
    const purchases = await Purchase.find().lean()
    if (!purchases?.length)
        return res.status(404).json({ message: "no purchases found" })
    return res.status(200).json(purchases)
}

const readPurchasesByUserId = async (req,res) => {
    const user_id = req.user._id
    if (!user_id) {
        return res.status(400).json({ message: "user required" })
    }
    const purchases = await Purchase.findById(user_id).lean()

    if(!purchases)
        return res.status(404).json({ message: "no purchase for this user" })
    return res.status(200).json(purchases)
}

const updatePurchase = async (req, res) => {
    const { _id, products ,paymentType} = req.body
    if(!_id){
        return res.status(400).json({message: "error on updating"})
    }
    if (!products) {
        return res.status(400).json({ message: "nothing changed" })
    }
    const purchase = await Purchase.findById(_id).exec()
    if (!purchase) {
        return res.status(400).json({ message: "no such purchase" })
    }
    purchase.products = products
    
    const updatedPurchase = await purchase.save()
    const purchases = await Purchase.find().lean()
    return res.status(200).json(purchases)  
}

const deletePurchase = async (req,res)=> {
    const {_id} = req.body
    const purchase = await Purchase.findById(_id).exec()
    if(!purchase){
        return res.status(404).json({ message: "purchase not found" })
    }
    const result = await purchase.deleteOne()
    const purchases = await Purchase.find().lean()
    if (!purchases?.length)
        return res.status(404).json({ message: "no purchases found" })
    return res.status(200).json(purchases)

}

module.exports = {createPurchase, readPurchases, readPurchasesByUserId, updatePurchase, deletePurchase}