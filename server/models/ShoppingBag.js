const mongoose = require('mongoose');

const shoppingBagSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        immutable: true,
        refPath: 'type' // Dynamically determine the referenced model
    },
    type: { // Indicates the type of product
        type: String,
        enum: ["Overhead", "MiniCenteral", "MultiIndoorUnit", "MultiOutdoorUnit"], // These should match your model names
        required: true
    },
    amount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ShoppingBag', shoppingBagSchema)