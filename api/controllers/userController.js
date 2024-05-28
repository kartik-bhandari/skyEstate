import bcryptjs from 'bcryptjs'
import User from '../models/userModel.js'
import errorHandler from '../utils/error.js'
import Listing from '../models/listingModel.js'

// export const test = (req,res)=>{
//     res.json({
//         message:'Hello world!'
//     })
// }

export const updateUser = async(req,res,next) =>{
    // console.log(req.user)
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, "You can not access"))
    }
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id , {
            $set:{
                username:req.body.username,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        }, {new:true})

        const {password , ...rest} = updateUser._doc;
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

export const deleteUser = async(req,res,next) =>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, "unauthorized"))
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json({message: 'user has been deleted'})
    } catch (error) {
        next(error)
        
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  };

  export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user) return next(errorHandler(404, 'User not found!'))
        
        const {password: pass, ...rest} = user._doc
        res.status(200).json(rest);  
    } catch (error) {
        next(error)
    }
    
  }
