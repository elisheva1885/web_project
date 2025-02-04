const mongoose = require('mongoose')
const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        immutable: true
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "??????"
     },
    sum: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Purchase', purchaseSchema)