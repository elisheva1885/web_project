const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        immutable: true
    },
    country: {
        type: String,
        required: true,
        default: "ישראל"
    },
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    building_num: {
        type: Number,
        required: true,
    },
    apartment_num: {
        type: Number,
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
    zip_code: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Address', addressSchema)