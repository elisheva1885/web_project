const jwt = require('jsonwebtoken')
const verifyJWT = (req, res, next)=> {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')  || authHeader==="Bearer null"){
        return res.status(401).json({ code: "UNAUTHORIZED" });
    }
    const token = authHeader.split(' ')[1]

    // if(authHeader==="Bearer null"){
    //     return res.status(401).json({message : 'Unauthorized'})
    // }
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err){
                return res.status(403).json({code: 'Forbidden'})
            }
            req.user = decoded            
            next()
        }
    )
}
module.exports = verifyJWT

