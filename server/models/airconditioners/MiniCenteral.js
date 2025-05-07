const mongoose = require('mongoose')
const minicenteralSchema = new mongoose.Schema({
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
    efficiency_factor: {//מקדם יעילות
        cool: { type: String },
        heat: { type: String }
    },
    energy_rating:{//דיורג אנרגטי
        type: String 
    },
    working_current: {//זרם עבודה
        cool: { type: String },
        heat: { type: String }
    },
    CFM:{
        type:String
    },
    Pa:{//לחץ סטטי
        type:Number
    },

    pipe_connection: {
        a:{ type:String},
        b:{ type:String},
    },
    in_size: {
        width: {type: Number},
        depth: {type: Number},    
        height: {type: Number},
    },
    out_size: {
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
    speeds: {
        type: Number
    },
    air4d:{
        type: Boolean,
        default:false
    },

    sabbath_command: {
        type: Boolean,
        default:false
    },

})

module.exports = mongoose.model('MiniCenteral', minicenteralSchema)