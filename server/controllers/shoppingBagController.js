const ShoppingBag = require("../models/ShoppingBag")
const Overhead = require("../models/airconditioners/Overhead")


//לבדוק בפוסטמן
const createShoppingBag= async (req,res)=>{
    const user_id = req.user._id
    const { product_id,type, amount} = req.body
    if(!user_id || !product_id || !type){
        return res.status(400).json({ message: "all details are required" })
    }
    //checkging if allready exist
    const shoppingBag = await ShoppingBag.create({user_id, product_id,type, amount})
    if(shoppingBag){
        return res.status(201).json(shoppingBag)
    }
}

const readShoppingBagByUserId = async (req,res)=> {
    const user_id = req.user._id
    if(!user_id){
        return res.status(400).json({message: "reqired"})
    }
    //returns the user products
    const shoppingBags =  await ShoppingBag.findById(user_id).lean()
    if(!shoppingBags){
        return res.status(400).json({ message: "shopping bag is empty" })
    }
    const userShoppingBags = [];
    shoppingBags.forEach(async (shoppingBag) => {
        switch (shoppingBag.type) {
            case "overhead":
                const overhead = await Overhead.findById(shoppingBag.product_id).populate("company").lean()
                userShoppingBags.push(overhead)
                break;
        
            default:
                break;
        }
    });
    return res.status(200).json(userShoppingBags)
}
const updateShoppingBagAmount = async (req,res)=> {
    const {_id, amount} =req.body
    if(!_id){
        return res.status(400).json({message: "error on updating"})
    }
    if(!amount){
        return res.status(400).json({ message: "nothing changed" })
    }
    const shoppingBag = await ShoppingBag.findById(_id).exec()
    if(!shoppingBag){
        return res.status(400).json({ message: "not fount in shopping bag" })
    }
    shoppingBag.amount = amount

    const updatedShoppingBag = await shoppingBag.save()

    return res.status(201).json(updatedShoppingBag)
 
}
const deleteShoppingBag = async (req,res)=>{
    const {_id} = req.body
    const shoppingBag = await ShoppingBag.findById(_id).exec()
    if(!shoppingBag){
        return res.status(404).json({message:"not fount in shopping bag"})
    }
    const result = await shoppingBag.deleteOne()
    return res.status(200).json({message:"deleted success"})
}

module.exports = {createShoppingBag, readShoppingBagByUserId,updateShoppingBagAmount , deleteShoppingBag}