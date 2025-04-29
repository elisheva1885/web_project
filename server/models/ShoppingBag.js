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
// Middleware to normalize the 'type' field
shoppingBagSchema.pre('save', function (next) {
    if (this.type) {
        this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1).toLowerCase();
    }
    next();
});

module.exports = mongoose.model('ShoppingBag', shoppingBagSchema);