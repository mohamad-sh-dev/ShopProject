const Order = require('../model/order')
const cathAsync = require('../utils/cathAsync');
const sendResponse = require('../utils/sendResponse');


exports.setOrder = cathAsync(async(req,res,next)=>{
    console.log('hiiiiiiiiii');
    const user = await req.user.populate('cart.items.productId').execPopulate()

    const products = user.cart.items.map((i)=>{
        return {Quantity : i.Quantity , product : {...i.productId._doc}};
       
    });
    const newOrder = new Order({
        user : {
            number : req.user.number , 
            userId: req.user.id
        },
        products
    })

    const order =  await newOrder.save()
    await req.user.clearCart()
    sendResponse(order , "success" , 200 , res) 
   
})

 exports.getMyOrders = cathAsync(async(req,res,next)=>{
     const order = await Order.find({'user.userId' : req.user.id})

    sendResponse(order , "success" , 200 , res) 
 })