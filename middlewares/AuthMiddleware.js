import jwt from "jsonwebtoken";

export const veriifyToken = async (req, res , next) => {
    const token = req.cookies.jwt
    if(!token)return res.status(401).send({message:'You are not authenticated!'});
    jwt.verify(token , process.env.JWT_KEY,async (err, payload) => {
        if(err) res.status(403).send({message:"Token is invalid"});
        req.userId = payload.id;
        next();
    })
}