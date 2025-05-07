const mongoose = require('mongoose')
const MultiIndoorUnitSchema = new mongoose.Schema({
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
    CFM:{
        type:String
    },
    pipe_connection: {
        a:{ type:String},
        b:{ type:String},
    },
    evaporator_unit_dimensions: { //מידות המאייד
        width: {type: Number},
        depth: {type: Number},    
        height: {type: Number},
    },
}
)

module.exports = mongoose.model('MultiIndoorUnit', MultiIndoorUnitSchema)