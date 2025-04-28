const Purchase = require("../models/Purchase")
const mongoose = require('mongoose')
const shoppingBagController = require("../controllers/shoppingBagController");
const ShoppingBag = require("../models/ShoppingBag");
const Overhead = require("../models/airconditioners/Overhead");
const MiniCenteral = require("../models/airconditioners/MiniCenteral");

const createPurchase = async (req, res) => {
    const user_id = req.user._id
    const { products , paymentType} = req.body
    console.log("createPurchase the products", products);
    // const transformedProducts = products.map(product => {
    //     if (mongoose.Types.ObjectId.isValid(product.product._id)) {
    //       product.product._id = new mongoose.Types.ObjectId(product.product._id); // Convert to ObjectId
    //     } else {
    //       console.error(`Invalid ObjectId: ${product.product._id}`); // Handle invalid ObjectId
    //     }
    //     return product; // Return the updated product object
    //   });
      
    //   console.log(transformedProducts); // Logs the updated products array
        // if (mongoose.Types.ObjectId.isValid(product.product._id)) {
        //   product.product._id = new mongoose.Types.ObjectId(product.product._id); // Convert only if valid
        // } else {
        //   throw new Error(`Invalid ObjectId: ${product.product}`); // Handle invalid ObjectId
        // }
        // return product;
    //   });
    if (!user_id || !products?.length || !paymentType) {
        return res.status(400).json({ message: "all details are required" })
    }
    try{
        const result = checkProductsStock(products)
        console.log("result", result);
    }
    catch(e){
        console.log("error", e);
    }
    // const purchase = await Purchase.create({user_id, products,paymentType})
    // if (purchase) {
    //     // const purchases = await Purchase.find().lean()
    //     // console.log("here", purchase);
    //     return res.status(201).json(purchase)
    // }
    // else {   
    //     return res.status(400).json({ message: "invalid purchase" })
    // }
}


const checkProductsStock = async (products)=>{
    // products.map(product=>
    //     // await shoppingBagController.getProductByIdAndType(product.product._id, product.type, product.amount)
    // )   
    try {
        const results = await Promise.all(
          products.map(async (product) => {
            const productDetails = await ShoppingBag.findById(product).lean();
            console.log("ppppp",productDetails);
            const result = await changeProductStockByIdAndType(
              productDetails.product_id,
              productDetails.type,
              productDetails.amount
            );
            if (result.message !== 'Ok') {
              throw new Error(`${productDetails} is out of stock from ${productDetails.type}`);
            }

            return { status: 'Ok', product: productDetails };
          })
        );
        console.log(results);
        return {status:200, message: 'All products are in stock', results };
      } catch (error) {
        console.error('Error checking stock:', error.message);
        return {status:400, message: error.message };
      }
} 


const changeProductStockByIdAndType = async (_id, type, amount)=>{
    switch (type) {
        case "overhead":
            const overhead = await Overhead.findById({ _id: _id }).populate("company").exec()
            if(overhead){
                if (overhead.stock < amount) {
                    console.log("in error");
                    return {message:`not enough, there is only ${overhead.stock} in the stock`};
                }
                overhead.stock = overhead.stock - amount
                const updatedOverhead = await overhead.save()
                return {message : `Ok`}
            }
            else{
                return {message: `not found`}
            }
            
            //delete from the basket
            break;
        case "miniCenteral":
            const miniCenteral = await MiniCenteral.findById({ _id:_id}).populate("company").exec()
            if(miniCenteral){
                if (miniCenteral.stock < amount) {
                    return {message:`not enough, there is only ${miniCenteral.stock} in the stock`};
                }
                miniCenteral.stock = miniCenteral.stock - amount
                const updatedMiniCenteral = await miniCenteral.save()
                return {message : `Ok`}
            }
            else{
                return {message: `not found`}
            }
            
            //delete from the basket
            break;
        default:
            break;
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