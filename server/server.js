require("dotenv").config()
const express = require("express")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const dbconnect = require("./config/dbconnect")
const { default: mongoose } = require("mongoose")
const PORT = process.env.PORT || 7000
const app = express()
dbconnect()

app.use(cors(corsOptions))
app.use((express.json()))
app.use(express.static("public"))
app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/branches", require("./routes/branchRoute"))
app.use("/api/air-conditioner/overhead", require("./routes/overheadRoute"))
app.use("/api/company", require("./routes/companyRoute"))
app.use("/api/user/shoppingBag", require("./routes/shoppingBagRoute"))
app.get("/", (req,res)=>{
    res.send("home page")
})


mongoose.connection.once('open',()=>{
    console.log('Connect to database')
    app.listen(PORT,()=>{
        console.log(`server running on ${PORT}`);
    })
})

mongoose.connection.on('error', err=> {
    console.log(err)
})
