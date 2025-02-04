const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    imagePath: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Company', companySchema)