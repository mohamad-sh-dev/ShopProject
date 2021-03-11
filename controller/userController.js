const AppError = require ('../utils/appErrors')
const catchAsync = require('../utils/cathAsync')
const User = require('../model/users')
const SendResponse = require("../utils/sendResponse")


exports.getAllusers = catchAsync(async (req, res ,next)=>{

    const users = await User.find()
    if(users) return next(new AppError("کاربری وجود ندارد ", 404))
    SendResponse(users , "success" , 200 , res)
})

exports.createUser = catchAsync(async(req,res,next)=>{
    // 1 Create user 
    const newUser = await User.create(req.body)
    // 2 send verification sms to his number
    
    // 3 send response 
    SendResponse(newUser ,"success" , 201 , res )
})