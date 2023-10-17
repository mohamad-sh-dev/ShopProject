const cathAsync = require("../utils/cathAsync");
const Product = require("../model/products");
const sendResponse = require("../utils/sendResponse");
const AppError = require("../utils/appErrors");

exports.addtoCart = cathAsync(async (req, res, next) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
    if (!product) return next(new AppError("محصول یافت نشد", 404))
    const cart = await req.user.addToCart(product)
    // use loop for send better response 
    for (item of cart.cart.items)
        if (item.productId == productId) {
            sendResponse(item, "success", 201, res)
        }
})
exports.decreaseQuantity = cathAsync(async (req, res, next) => {
    const productId = req.params.id
    const removedItem = await req.user.decreaseQuantity(productId)
    for (item of removedItem.cart.items) {
        if (item.productId == productId) {
            sendResponse(item, "success", 201, res)
        }
    }
})
exports.removerFromCart = cathAsync(async (req, res, next) => {
    const productId = req.params.id
    const removedItem = await req.user.removedFromCart(productId)
    sendResponse(removedItem, "success", 204, res)
})
exports.clearCart = cathAsync(async (req, res, next) => {
    const cart = await req.user.clearCart();
    sendResponse(cart, 'success', 204, res);
})
exports.getCheckOut = cathAsync(async (req, res, next) => {
    try {
        var total = 0
        var products
        var user = await req.user.populate('cart.items.productId').execPopulate()
        console.log(user);
        products = await user.cart.items
        //    console.log(user.cart.items);
        // cal total price of user products
        products.forEach((p) => {
            total += p.Quantity * p.productId.price
        })
        // console.log(total);
        res.status(200).json({
            Status: 'success',
            Result: products.length,
            products,
            total
        })
    } catch (error) {
        console.log(error);
        next(error)
    }

})