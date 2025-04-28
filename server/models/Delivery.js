const mongoose = require('mongoose')
const deliverySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        immutable: true
    },
    address: {
        type:  mongoose.Schema.Types.ObjectId,
         ref: 'Address' ,
        required: true
    },
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase', 
        required: true
    },
    status: {
        type: String,
        enum: ["waiting to be delivered","on the way","arrived","recieved"],
        default: "waiting to be delivered"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Delivery', deliverySchema)