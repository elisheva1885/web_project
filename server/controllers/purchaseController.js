const Purchase = require("../models/Purchase")
const mongoose = require('mongoose')
const shoppingBagController = require("../controllers/shoppingBagController");
const ShoppingBag = require("../models/ShoppingBag");
const Overhead = require("../models/airconditioners/Overhead");
const MiniCenteral = require("../models/airconditioners/MiniCenteral");

const createPurchase = async (req, res) => {
    const user_id = req.user?._id
    const { products, paymentType } = req.body

    if (!user_id || !products?.length || !paymentType) {
        return res.status(400).json({ message: "REQUIRED_FIELDS_MISSING" })
    }
    try {
        const result = await checkProductsStock(products)
        if (result.status === 200) {
            const purchase = await Purchase.create({ user_id, products, paymentType })
            if (purchase) {
                return res.status(201).json(purchase)
            }
            else {
                return res.status(400).json({ message: "PURCHASE_CREATION_FAILED" })
            }
        }
        else {
            return res.status(result.status).json({ message: result.message })
        }
    } catch (error) {
        console.error("Error creating purchase:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}


const checkProductsStock = async (products) => {
    try {
        const results = await Promise.all(
            products.map(async (product) => {
                const productDetails = await ShoppingBag.findById(product).lean();
                if (!productDetails) {
                    return { status: 404, message: "PRODUCT_NOT_FOUND" };
                }
                const result = await changeProductStockByIdAndType(
                    productDetails.product_id,
                    productDetails.type,
                    productDetails.amount
                );
                if (result.status == 400) {
                    return { status: 400, message: "PRODUCT_OUT_OF_STOCK" };
                }
                return { status: 200, message: 'OK', product: productDetails };
            })
        );
        const badResult = results.find((result) => result.status !== 200);
        if (badResult) {
            return badResult;
        }
        return { status: 200, message: 'ALL_PRODUCTS_IN_STOCK', results };
    } catch (error) {
        console.error('Error checking stock:', error.message);
        return { status: 500, message: "INTERNAL_ERROR" };
    }
}

const changeProductStockByIdAndType = async (_id, type, amount) => {
    try {
        const Model = mongoose.model(type);
        const airConditioner = await Model.findOne({ _id: _id }).populate("company").exec()
        if (!airConditioner) {
            return { status: 404, message: `PRODUCT_NOT_FOUND` };
        }
        if (airConditioner.stock < amount) {
            return { status: 400, message: `OUT_OF_STOCK` };
        }
        airConditioner.stock -= amount
        const updatedAirConditioner = await airConditioner.save()
        return { status: 200, message: `STOCK_UPDATED_SUCCESSFULLY` }
    } catch (error) {
        console.error('Error changing product stock:', error.message);
        return { status: 500, message: "INTERNAL_ERROR" };
    }
}

const readPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().lean()
        if (!purchases?.length)
            return res.status(404).json({ message: "NO_PURCHASES_FOUND" })
        return res.status(200).json(purchases)
    } catch (error) {
        console.error("Error reading purchases:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readPurchasesByUserId = async (req, res) => {
    const user_id = req.user?._id
    if (!user_id || typeof user_id !== "string" || user_id.length !== 24) {
        return res.status(400).json({ message: "INVALID_USER_ID" });
    }

    try {
        const purchases = await Purchase.findById(user_id).lean()
        if (!purchases?.length) {
            return res.status(404).json({ message: "NO_PURCHASES_FOR_USER" });
        }
        return res.status(200).json(purchases);
    } catch (error) {
        console.error("Error fetching purchases for user:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const updatePurchase = async (req, res) => {
    const { _id, products, paymentType } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_PURCHASE_ID" });
    }

    if (!products && !paymentType) {
        return res.status(400).json({ message: "NO_FIELDS_TO_UPDATE" });
    }

    try {
        const purchase = await Purchase.findById(_id).exec()
        if (!purchase) {
            return res.status(404).json({ message: "PURCHASE_NOT_FOUND" })
        }
        if (products) {
            purchase.products = products;
        }
        if (paymentType) {
            purchase.paymentType = paymentType;
        }
        const updatedPurchase = await purchase.save()
        const purchases = await Purchase.find().lean()
        return res.status(200).json(purchases)
    } catch (error) {
        console.error("Error updating purchase:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const deletePurchase = async (req, res) => {
    const { _id } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_PURCHASE_ID" });
    }

    try {
        const purchase = await Purchase.findById(_id).exec()
        if (!purchase) {
            return res.status(404).json({ message: "PURCHASE_NOT_FOUND" })
        }
        const result = await purchase.deleteOne()
        return res.status(200).json({ message: "PURCHASE_DELETED_SUCCESSFULLY" });
    } catch (error) {
        console.error("Error deleting purchase:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR"});
    }
}

module.exports = { createPurchase, readPurchases, readPurchasesByUserId, updatePurchase, deletePurchase }