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
    BTU_output: {
        cool: { type: Number },
        heat: { type: Number }
    },
    energy_rating:{//דיורג אנרגטי
        cool: { type: String },
        heat: { type: String }
    },
    working_current: {//זרם עבודה
        cool: { type: String },
        heat: { type: String }
    },
    recommended_model_C:{
        type:String
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
    air_flow:{//xphe, tuuhr ספיקת אוויר
        type:Number
    },
    //icons
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
    night_mode: {
        type: Boolean,
        default:false
    },
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


}
)

module.exports = mongoose.model('Overhead', overheadSchema)