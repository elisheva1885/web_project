const jwt = require('jsonwebtoken')
const adminVerify = (req, res, next)=> {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({ message: "UNAUTHORIZED" });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err){
                return res.status(401).json({ message: "Forbidden" });
            }
            req.user = decoded
            const userRole = req.user.roles
            // console.log(req.user);
            if(userRole!="admin"){
                return res.status(403).json({message: 'Access_denied'})
            }
            next()
        }
    )
}
module.exports = adminVerify

