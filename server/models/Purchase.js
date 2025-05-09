const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        immutable: true
    },
    products: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingBag' }],
        required: true,
     },
     paymentType:{
        type: String,
        enum: ["paypal", "google"],
        required:true
     }

}, {
    timestamps: true
})
module.exports = mongoose.model('Purchase', purchaseSchema)