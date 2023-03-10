const jwt = require("jsonwebtoken")
const User = require("../model/user")
const auth = async function(req,res,next){

    // console.log("inside auth ")
    try {
        // console.log(req.header("Authorization"));
        const token = req.header("Authorization").replace("Bearer ","");
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({"_id":decoded._id, "tokens.token" : token});
        if(!user){
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();

    } catch (e) {
        res.status(401).send({"message" : "you are not authorized"})
    }
}
module.exports = auth