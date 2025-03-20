const ShoppingBag = require("../models/ShoppingBag")
const Overhead = require("../models/airconditioners/Overhead")


//לבדוק בפוסטמן
const createShoppingBag= async (req,res)=>{
    const user_id = req.user._id
    const { product_id,type, amount} = req.body
    // console.log(product_id,type, amount)
    if(!user_id || !product_id || !type){
        return res.status(400).json({ message: "all details are required" })
    }
    console.log("user, pro",user_id, product_id)

    const duplicate = await ShoppingBag.findOne({ 
        user_id: user_id,
        product_id:product_id,
    }).lean()
    console.log("duplicate", duplicate)
    if (duplicate) {
        return res.status(409).json({ message: "already exist" })
    }

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
    const shoppingBags =  await ShoppingBag.find({user_id:user_id}).lean()
    if(!shoppingBags){
        return res.status(400).json({ message: "shopping bag is empty" })
    }
    // let userShoppingBags = new Array();
    let i = 1;
    const promises = shoppingBags.map(async (shoppingBag) => {
        switch (shoppingBag.type) {
            case "overhead":
                const overhead = await Overhead.find({_id: shoppingBag.product_id}).populate("company").lean()
                // userShoppingBags.push(overhead)
                return overhead;        
            default:
                break;
        }

    });
    const results = await Promise.all(promises)
    // console.log(userShoppingBags) 
    const userShoppingBags = results.filter(result => result !== null).flat(); //filter null values and flatten the array.

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

    const {product_id} = req.body
    const shoppingBagByProduct = await ShoppingBag.findOne({product_id: product_id}).exec()
    if(!shoppingBagByProduct){
        return res.status(404).json({message:"no such product"})
    }
    console.log(shoppingBagByProduct);
    const _id = shoppingBagByProduct._id
    console.log(_id);
    const shoppingBag = await ShoppingBag.findById(_id).exec()

    if(!shoppingBag){
        return res.status(404).json({message:"not fount in shopping bag"})
    }
    console.log(shoppingBag)

    const result = await shoppingBag.deleteOne()
    // const shoppingBags = readShoppingBagByUserId()
    // return res.status(200).json({shoppingBags})
    return res.status(200).json({message: "deleted succes" })

}

module.exports = {createShoppingBag, readShoppingBagByUserId,updateShoppingBagAmount , deleteShoppingBag}