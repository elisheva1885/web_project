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
<<<<<<< HEAD

=======
>>>>>>> 49384975ca909cdc4fbbaa7e4b19832e11b02bc9

module.exports = mongoose.model('ShoppingBag', shoppingBagSchema)