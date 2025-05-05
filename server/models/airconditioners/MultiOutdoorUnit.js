const mongoose = require('mongoose')
const MultiOutdoorUnitSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    imagepath: {
        type: String,
        required: true
    },
    stock:{
        type:Number,
        default: 1
    },
    price:{
        type:Number,
        required:true
    },
    BTU_output: {
        cool: { type: Number },
        heat: { type: Number }
    },
    working_current: {//זרם עבודה
        cool: { type: String },
        heat: { type: String }
    },
    condenser_unit_dimensions: {
        width: {type: Number},
        depth: {type: Number},    
        height: {type: Number},
    },
    quiet:{
        type: Boolean
    }, 
    wifi:{
        type: Boolean,
        default:false
    },
    // speeds: {
    //     type: Number
    // },
    // air4d:{
    //     type: Boolean,
    //     default:false
    // },
    // night_mode: {
    //     type: Boolean,
    //     default:false
    // },
    timer: {
        type: Boolean,
        default:false
    },
    sabbath_command: {
        type: Boolean,
        default:false
    },
    onof_auto:{
        type: Boolean,
        default:false
    }
})

module.exports = mongoose.model('MultiOutdoorUnit', MultiOutdoorUnitSchema)