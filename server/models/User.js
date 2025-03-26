const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
        name:{
            type: String,
            required:true,
            immutable:true
        },
        username: {
            type:String,
            required: true,
            uniqe: true,
            immutable:true
        },
        password:{
            type: String,
            required: true
        },
        email:{
            type:String,
            lowercase: true,
            trim:true
        },
        phone:{
            type:String
        },
        roles:{
            type:String,
            enum: ["user","admin","official"],
            default: "user"
        }
    }
)

module.exports = mongoose.model('User', userSchema)