const ShoppingBag = require("../models/ShoppingBag");
const MiniCenteral = require("../models/airconditioners/MiniCenteral");
const MultiIndoorUnit = require("../models/airconditioners/MultiIndoorUnit");
const MultiOutdoorUnit = require("../models/airconditioners/MultiOutdoorUnit");
const Overhead = require("../models/airconditioners/Overhead")
const mongoose = require('mongoose');


//לבדוק בפוסטמן
const createShoppingBag = async (req, res) => {
    const user_id = req.user._id

    // console.log("user", user_id);
    const { product_id, type, amount } = req.body
    // console.log(product_id,type, amount)
    if (!user_id || !product_id || !type) {
        return res.status(400).json({ message: "all details are required" })
    }
    // console.log("user, pro", user_id, product_id)
    const duplicate = await ShoppingBag.findOne({
        user_id: user_id,
        product_id: product_id,
    }).exec()
    // console.log("duplicate", duplicate)
    if (duplicate) {
        console.log("duplicate product ", duplicate);
        duplicate.amount++
        const updatedShoppingBag = await duplicate.save()
        return res.status(200).json({ message: "update amount" })
        // return res.status(409).json({ message: "already exist in the basket" })
    }
    
    const shoppingBag = await ShoppingBag.create({ user_id, product_id, type, amount })
    if (shoppingBag) {
        return res.status(201).json(shoppingBag)
    }
}

const readShoppingBagByUserId = async (req, res) => {
    // console.log("readShoppingBagByUserId");
    const user_id = req.user._id
    if (!user_id) {
        return res.status(400).json({ message: "reqired" })
    }
    const shoppingBags = await ShoppingBag.find({ user_id: user_id }).lean()
    if (!shoppingBags) {
        return res.status(400).json({ message: "shopping bag is empty" })
    }
    const promises = shoppingBags.map(async (shoppingBag) => {
        // console.log(shoppingBag.type)
        // switch (shoppingBag.type) {
            const Model = mongoose.model(shoppingBag.type);
            const airConditioner = await Model.findOne({ _id: shoppingBag.product_id }).populate("company").lean()
                 if (airConditioner.stock >= 0) {
                    return { product: airConditioner, amount: shoppingBag.amount, type: shoppingBag.type, shoppingBagId: shoppingBag._id };
                }
            // case "Overhead":
            //     const overhead = await Overhead.findOne({ _id: shoppingBag.product_id }).populate("company").lean()
            //     if (overhead.stock >= 0) {
            //         return { product: overhead, amount: shoppingBag.amount, type: shoppingBag.type, shoppingBagId: shoppingBag._id };
            //     }
            //     return res.status(400).json({ message: "inValid stock amount" })

            // case "MiniCenteral":
            //     const miniCenteral = await MiniCenteral.findOne({ _id: shoppingBag.product_id }).populate("company").lean()
            //     if (miniCenteral) {
            //         return { product: miniCenteral, amount: shoppingBag.amount, type: shoppingBag.type, shoppingBagId: shoppingBag._id };
            //     }
            //     return res.status(400).json({ message: "inValid stock amount" })
            // case "MultiOutdoorUnit":
            //     const multiOutdoorUnit = await MultiOutdoorUnit.findOne({ _id: shoppingBag.product_id }).populate("company").lean()
            //     if (multiOutdoorUnit) {
            //         return { product: multiOutdoorUnit, amount: shoppingBag.amount, type: shoppingBag.type, shoppingBagId: shoppingBag._id };
            //     }
            //     return res.status(400).json({ message: "inValid stock amount" })
            // case "MultiIndoorUnit":
            //     const multiIndoorUnit = await MultiIndoorUnit.findOne({ _id: shoppingBag.product_id }).populate("company").lean()
            //     if (multiIndoorUnit) {
            //         return { product: multiIndoorUnit, amount: shoppingBag.amount, type: shoppingBag.type, shoppingBagId: shoppingBag._id };
            //     }
            //     return res.status(400).json({ message: "inValid stock amount" })
            // default:
            //     break;
        }
    // }
    );
    const results = await Promise.all(promises)
    const userShoppingBags = results.filter(result => result !== null).flat(); //filter null values and flatten the array.
    // console.log(userShoppingBags);
    return res.status(200).json(userShoppingBags)
}

const updateShoppingBagAmount = async (req, res) => {
    const user_id = req.user._id
    const { product_id, amount } = req.body
    // console.log(product_id, amount);
    if (!product_id) {
        return res.status(400).json({ message: "error on updating" })
    }
    if (!amount) {
        return res.status(400).json({ message: "nothing changed" })
    }
    const shoppingBag = await ShoppingBag.findOne({ product_id: product_id, user_id: user_id }).exec()
    // console.log("sh",shoppingBag);
    if (!shoppingBag) {
        return res.status(400).json({ message: "not fount in shopping bag" })
    }
    // console.log(shoppingBag);
    const response = await checkProductStockByIdAndType(shoppingBag.product_id, shoppingBag.type, amount)
    console.log(response);
    // console.log("respone",response);
    if (response.status === 200) {
        // console.log(shoppingBag.amount);
        shoppingBag.amount = amount
        // console.log(amount);
        const updatedShoppingBag = await shoppingBag.save()
        // console.log("update",updatedShoppingBag);
        return res.status(200).json({ updatedShoppingBag })
    }
    else {
        return res.status(response.status).json({ message: response.message })
    }
}

// const checkProductStock = async (product , amount)=>{
//     const res =  await getProductByIdAndType(product._id, product.type)
//     // console.log("the res in check", res);
//     // return res.then((result) => {
//     //     console.log(result); // Logs the resolved value (e.g., {message: "Ok"} or {message: "not enough..."})
//     // })
//     // .catch((error) => {
//     //     console.error("Error:", error);
//     // });

// }

const checkProductStockByIdAndType = async (_id, type, amount) => {
    console.log(type);

    const Model = mongoose.model(type);
    const airConditioner = await Model.findOne({ _id: _id }).populate("company").lean()
    if (airConditioner.stock < amount) {
        return { status: 400, message: `not enough, there is only ${airConditioner.stock} in the stock` };
    }
    return { status: 200, message: `Ok` }
    // switch (type) {
    //     case "Overhead":
    //         const overhead = await Overhead.findById({ _id: _id }).populate("company").lean()
    //         if (overhead.stock < amount) {
    //             return { status: 400, message: `not enough, there is only ${overhead.stock} in the stock` };
    //         }
    //         return { status: 200, message: `Ok` }
    //         //delete from the basket
    //         break;
    //     case "MiniCenteral":
    //         const miniCenteral = await MiniCenteral.findById({ _id: _id }).populate("company").lean()
    //         if (miniCenteral.stock < amount) {
    //             return { status: 400, message: `not enough, there is only ${miniCenteral.stock} in the stock` };
    //         }
    //         return { status: 200, message: `Ok` }
    //     case "MultiIndoorUnit":
    //         const multiIndoorUnit = await MultiIndoorUnit.findById({ _id: _id }).populate("company").lean()
    //         if (multiIndoorUnit.stock < amount) {
    //             return { status: 400, message: `not enough, there is only ${multiIndoorUnit.stock} in the stock` };
    //         }
    //         return { status: 200, message: `Ok` }
    //     case "MultiOutdoorUnit":
    //         const multiOutdoorUnit = await MultiOutdoorUnit.findById({ _id: _id }).populate("company").lean()
    //         if (multiOutdoorUnit.stock < amount) {
    //             return { status: 400, message: `not enough, there is only ${multiOutdoorUnit.stock} in the stock` };
    //         }
    //         return { status: 200, message: `Ok` }
    //     //delete from the basket
    //     default:
    //         break;
    // }
}



const deleteShoppingBag = async (req, res) => {
    const { product_id } = req.body
    const user_id = req.user._id
    // console.log(user_id);
    const shoppingBagByProduct = await ShoppingBag.findOne({ product_id: product_id }).exec()
    if (!shoppingBagByProduct) {
        return res.status(404).json({ message: "no such product" })
    }
    // console.log(shoppingBagByProduct);
    const _id = shoppingBagByProduct._id
    // console.log(_id);
    const shoppingBag = await ShoppingBag.findById(_id).exec()

    if (!shoppingBag) {
        return res.status(404).json({ message: "not fount in shopping bag" })
    }
    // console.log(shoppingBag)

    const result = await shoppingBag.deleteOne()

    // readShoppingBagByUserId()
    // return res.status(200).json({shoppingBags})
    return res.status(200).json(result)

}

module.exports = { createShoppingBag, readShoppingBagByUserId, updateShoppingBagAmount, deleteShoppingBag, checkProductStockByIdAndType }