const AppError = require ('../utils/appErrors')
const catchAsync = require('../utils/cathAsync')
const User = require('../model/users')
const sendResponse = require("../utils/sendResponse");

exports.getAllusers = catchAsync(async (req, res ,next)=>{
    const users = await User.find()
    if(!users) return next(new AppError("کاربری وجود ندارد ", 404))
    sendResponse(users , "success" , 200 , res)
})
exports.getUser= catchAsync(async ( req ,res ,next )=>{
    const id = req.params.id
    const user = await User.findById(id)
    sendResponse(user , "success" , 200 , res)
})

