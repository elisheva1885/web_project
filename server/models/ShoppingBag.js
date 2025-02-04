const mongoose = require('mongoose')
const shoppingBagSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.string,
        required: true,
        immutable: true
    },
    product_id: {
        type: mongoose.Schema.Types.string,
        required: true,
        immutable: true
     }
}, {
    timestamps: true
})
module.exports = mongoose.model('ShoppingBag', shoppingBagSchema)