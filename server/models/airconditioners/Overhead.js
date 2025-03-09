const mongoose = require('mongoose')
const overheadSchema = new mongoose.Schema({
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
    output: {
        cool: { type: String },
        heat: { type: String }
    },
    energy_rating:{//דיורג אנרגטי
        cool: { type: String },
        heat: { type: String }
    },
    working_current: {//זרם עבודה
        cool: { type: String },
        heat: { type: String }
    },
    recommended_methom:{
        type:Number
    },
    pipe_connection: {
        a1:{ type:Number},
        a2:{ type:Number},
        b1:{ type:Number},
        b2: { type:Number}
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
    air_flow:{//xphe, tuuhr
        type:Number
    },
    //icons
    quiet:{
        type: Boolean
    },
   
    wifi:{
        type: Boolean
    },
    speeds: {
        type: Number
    },
    air4d:{
        type: Boolean
    },
    night_mode: {
        type: Boolean
    },
    timer: {
        type: Boolean
    },
    sabbath_command: {
        type: Boolean
    },
    onof_auto:{
        type: Boolean
    }


}
)

module.exports = mongoose.model('Overhead', overheadSchema)