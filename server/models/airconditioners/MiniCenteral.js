const mongoose = require('mongoose')
const minicenteralSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true,
        uniqe: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        immutable: true
    },
    title: {
        type: String,
        required: true
    },
    describe: {
        type: String
    },
    imagepath: {
        type: String
    },
    stock:{
        type:Number,
        default: 1
    },
    price:{
        type:Number,
        required:true
    },
    output: {
        cool: { type: String },
        heat: { type: String }
    },
    size: {
        length: {type: Number},
        width: {type: Number},
        height: {type: Number},
    },
    speeds: {
        type: Number
    },
    swing: {
        updown:{type: Boolean},
        leftright:{type: Boolean}
    },
    timer: {
        type: Boolean
    },
    sabbath_command: {
        type: Boolean
    },
    night_mode: {
        type: Boolean
    }

}
)

module.exports = mongoose.model('MiniCenteral', minicenteralSchema)