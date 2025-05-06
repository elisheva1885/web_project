const ShoppingBag = require("../models/ShoppingBag");
const MiniCenteral = require("../models/airconditioners/MiniCenteral");
const MultiIndoorUnit = require("../models/airconditioners/MultiIndoorUnit");
const MultiOutdoorUnit = require("../models/airconditioners/MultiOutdoorUnit");
const Overhead = require("../models/airconditioners/Overhead")
const mongoose = require('mongoose');


const createShoppingBag = async (req, res) => {
    try {
        const user_id = req.user._id
        const { product_id, type, amount } = req.body
    
        if (!user_id) {
            return res.status(400).json({ message: "INVALID_USER_ID" });
        }
        if (!product_id) {
            return res.status(400).json({ message: "INVALID_PRODUCT_ID" });
        }
        const validTypes = ["Overhead", "MiniCenteral", "MultiIndoorUnit", "MultiOutdoorUnit"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: `Invalid type: ${type}. Must be one of ${validTypes.join(', ')}` });
        }
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "INVALID_AMOUNT" });
        }
        const duplicate = await ShoppingBag.findOne({
            user_id: user_id,
            product_id: product_id,
        }).exec()

        if (duplicate) {
            duplicate.amount++
            const updatedShoppingBag = await duplicate.save()
            return res.status(200).json({ message: "UPDATE_AMOUNT" })
        }

        const shoppingBag = await ShoppingBag.create({ user_id, product_id, type, amount })
        if (shoppingBag) {
            return res.status(201).json(shoppingBag)
        }
        return res.status(400).json({ message: "INTERNAL_ERROR" });
    }
    catch (err) {
        return res.status(500).json({ message: "INTERNAL_ERROR" })
    }
}

const readShoppingBagByUserId = async (req, res) => {
    try {
        const user_id = req.user._id
        if (!user_id) {
            return res.status(400).json({ message: "INVALID_USER_ID" });
        }
        const shoppingBags = await ShoppingBag.find({ user_id: user_id }).lean()
        if (!shoppingBags || shoppingBags.length === 0) {
            return res.status(404).json({ message: "SHOPPING_BAG_EMPTY" });
        }
        const promises = shoppingBags.map(async (shoppingBag) => {
            try {
                const validTypes = ["Overhead", "MiniCenteral", "MultiIndoorUnit", "MultiOutdoorUnit"];
                if (!validTypes.includes(shoppingBag.type)) {
                    throw new Error(`INVALID_TYPE: ${shoppingBag.type}`);
                }

                const Model = mongoose.model(shoppingBag.type); // Dynamically get the model based on type
                const airConditioner = await Model.findOne({ _id: shoppingBag.product_id }).populate("company").lean()
                if (airConditioner.stock < 0) {
                    throw new Error(`OUT_OF_STOCK: ${shoppingBag.product_id}`);
                }
                return {
                    product: airConditioner,
                    amount: shoppingBag.amount,
                    type: shoppingBag.type,
                    shoppingBagId: shoppingBag._id,
                };
            }
            catch (err) {
                console.error(err.message);
                return null; // Catch individual errors but allow other promises to resolve
            }
        }
        );
        const results = (await Promise.all(promises)).filter((item) => item !== null);
        if (results.length === 0) {
            return res.status(404).json({ message: "NO_VALID_PRODUCTS_IN_SHOPPING_BAG" });
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updateShoppingBagAmount = async (req, res) => {
    try {
        const user_id = req.user._id
        const { product_id, amount } = req.body
        if (!user_id) {
            return res.status(400).json({ message: "INVALID_USER_ID" });
        }
        if (!product_id) {
            return res.status(400).json({ message: "INVALID_PRODUCT_ID" });
        }
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "INVALID_AMOUNT" });
        }
        const shoppingBag = await ShoppingBag.findOne({ product_id: product_id, user_id: user_id }).exec()
        if (!shoppingBag) {
            return res.status(404).json({ message: "NOT_FOUND_IN_SHOPPING_BAG" });
        }
        const response = await checkProductStockByIdAndType(shoppingBag.product_id, shoppingBag.type, amount);
        if (response.status !== 200) {
            console.log(response.message);
            return res.status(response.status).json({ message: response.message });
        }
        shoppingBag.amount = amount;
        const updatedShoppingBag = await shoppingBag.save();
        return res.status(200).json({ updatedShoppingBag });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
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
    try {
        const Model = mongoose.model(type);
        const airConditioner = await Model.findOne({ _id: _id }).populate("company").lean()
        if (!airConditioner) {
            return { status: 404, message: `PRODUCT_NOT_FOUND` };
        }
        if (airConditioner.stock < amount) {
            return { status: 400, message: `NOT_ENOUGH_STOCK` };
        }
        return { status: 200, message: `Ok` }
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return { status: 500, message: "INTERNAL_ERROR" };
    }

}



const deleteShoppingBag = async (req, res) => {
    try {
        const { product_id } = req.body
        const user_id = req.user._id
        if (!user_id) {
            return res.status(400).json({ message: "INVALID_USER_ID" });
        }
        if (!product_id || typeof product_id !== "string") {
            return res.status(400).json({ message: "INVALID_PRODUCT_ID" });
        }
        const shoppingBagByProduct = await ShoppingBag.findOne({ product_id: product_id }).exec()
        if (!shoppingBagByProduct) {
            return res.status(404).json({ message: "PRODUCT_NOT_FOUND_IN_SHOPPING_BAG" });
        }
        const shoppingBag = await ShoppingBag.findById(shoppingBagByProduct._id).exec();
        if (!shoppingBag) {
            return res.status(404).json({ message: "SHOPPING_BAG_ITEM_NOT_FOUND" });
        }
        const result = await shoppingBag.deleteOne()
        return res.status(200).json({ message: "PRODUCT_DELETED_FROM_SHOPPING_BAG" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createShoppingBag, readShoppingBagByUserId, updateShoppingBagAmount, deleteShoppingBag, checkProductStockByIdAndType }