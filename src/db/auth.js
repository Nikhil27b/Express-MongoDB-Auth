const jwt = require("jsonwebtoken");
const Users = require("../model/user");


const auth = async (req ,res , next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = await jwt.verify(token , process.env.SECRET_KEY)
        const user = await Users.findOne({_id:verifyUser});
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;