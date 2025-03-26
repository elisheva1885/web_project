const mongoose = require('mongoose')
const shoppingBagSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    product_id: {
        type: String,
        required: true,
        immutable: true
     },
     type:{
        type: String,
        enum: ["overhead", "miniCenteral","miniVrf", "multi"],
        required:true
     },
     amount:{
        type:Number,
        default:1
     }
}, {
    timestamps: true
})
module.exports = mongoose.model('ShoppingBag', shoppingBagSchema)