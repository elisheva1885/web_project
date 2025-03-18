const ShoppingBag = require("../models/ShoppingBag")


const createShoppingBag= async (req,res)=>{
    const {user_id, product_id,type} = req.body
    if(!user_id || !product_id || !type){
        return res.status(400).json({ message: "all details are required" })
    }
    //checkging if allready exist
    
}