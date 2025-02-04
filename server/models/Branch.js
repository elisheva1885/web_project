const mongoose = require('mongoose')
const branchSchema = new mongoose.Schema({
    address: {
        city:{
            type: String,
            required: true,
        },
        street:{
            type: String,
            required: true,
        },
        streetNum:{
            type: Number,
            required: true,
        }
    },
    phoneNumber:{
        type: String,
        required: true,
    },
    openingHour:{
        type: Number,
        required: true
    },
    closingHour:{
        weekdays:{
            type: Number,
            required: true,
        },
        fridays:{
            type: Number,
            required: true,
        }
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Branch', branchSchema)