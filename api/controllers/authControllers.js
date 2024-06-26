import User from '../models/userModel.js'
import bcryptjs from  'bcryptjs'
import errorHandler from '../utils/error.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export const signup = async(req,res,next)=>{
    const {username , email ,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password , 10)
    const newUser = new User({username , email , password:hashedPassword});
    const checkEmail = await User.findOne({email});
    const checkUser = await User.findOne({username});
    try{
        if(checkUser){
            return next(errorHandler(400,'Username already taken'))
        }
        if(checkEmail){
            return next(errorHandler(400,'Email already exists'))
        }
        await newUser.save()
        res.status(201).json("user created successfully")
    } catch(error){
        next(error)
    }
}

export const signin = async(req,res,next)=>{
    const {email, password} = req.body;
    console.log(process.env.JWT_SECRET)
    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,'User not found'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword){
            return next(errorHandler(401, 'incorrect password'))
        }
        const token = jwt.sign({id: validUser._id} , "random") 
        const {password : pass , ...rest} = validUser._doc
        res.cookie('access_token',token,{httpOnly:true ,expires: new Date(Date.now( ) + 24*60*60*1000)})
        .status(200)
        .json(rest)
    }catch(error){
        next(error)
    }
}

export const google = async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email})
        if(user){
            const token = jwt.sign({id:user._id} , "random")
            const {password: pass , ...rest} = user._doc
            res.cookie('access_token' , token, {httpOnly: true})
            .status(200)
            .json(rest)
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10)
            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() +Math.random().toString(36).slice(-4) , email: req.body.email, password:hashedPassword ,avatar:req.body.photo})
            await newUser.save();
            const token = jwt.sign({id:newUser._id} , "random")
            const {password: pass , ...rest} = user._doc
            res.cookie('access_token' , token, {httpOnly: true})
            .status(200)
            .json(rest)
        }
    } catch (error) {
        next(error)
    }
}

export const signOutUSer = async(req,res,next)=>{
    try {
        res.clearCookie('access-token');
        res.status(200).json('User has been loggged out')
    } catch (error) {
        next(error)    
    }
}
