import jwt from 'jsonwebtoken'
import errorHandler from './error.js'
import dotenv from 'dotenv';

dotenv.config()

export const verifyToken = (req,res,next) =>{
    const token = req.cookies.access_token

    if(!token){
        return next(errorHandler(401, 'unauthorized'))
    }
    jwt.verify(token, "random", (err,user)=>{
        if(err){
            return next(errorHandler(403, 'Forbidden'));
        }
        req.user = user;
        next()
    })
}
