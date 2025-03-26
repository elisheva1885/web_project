const mongoose = require("mongoose")

const dbconnect = async() => {
    try{
        await mongoose.connect(process.env.DB_URI)

    }
    catch(err){
        console.error("error on connection to DB "+ err)
    }
}

module.exports = dbconnect