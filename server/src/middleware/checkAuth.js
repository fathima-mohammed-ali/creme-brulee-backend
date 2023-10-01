const jwt= require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try {
        const token= req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decodeToken =jwt.verify(token,"unknown");
        // console.log(decodeToken);
        req.userData={loginID:decodeToken.loginid,username:decodeToken.userId}
        next();
        
    } catch (error) {
        res.status(401).json({message:"Auth failed!"});
        
    }
}