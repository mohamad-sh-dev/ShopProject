const catchAsync = require("../utils/cathAsync")
const apiFeature = require("../utils/apiFeatures")
const Error = require('../utils/appErrors')
const Products = require('../model/products')
const sendResponse = require('../utils/sendResponse')

exports.getAll = catchAsync(async (req, res, next) => {
    // Features sort filter limitFields pagination
    const features = new apiFeature(Products.find(),req.query)
    .filter().sort().limitFields().pagination()

    const products = await features.query
    if (!products) return next(new Error("محصولی وجود ندارد", 404))
    sendResponse(products, "success", 200, res)

})

exports.createProduct = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const newProduct = await Products.create(req.body)
    sendResponse(newProduct, "success", 201, res)

})

exports.getByNumber = catchAsync(async (req, res, next) => {

    const product = await Products.findOne({
        number: req.params.number
    })
    if (!product) return next(new Error("محصولی با این شناسه وجود ندارد", 404))

    sendResponse(product, "success", 200, res)
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new:true , 
        runValidators: true
    })
    if (!product) return next(new Error("محصولی با این شناسه وجود ندارد", 404))

    sendResponse(product, "success", 200, res)
})

exports.deleteProduct = catchAsync(async(req,res,next)=>{

    const product = await Products.findByIdAndDelete(req.params.id)
    if (!product) return next(new Error("محصولی با این شناسه وجود ندارد", 404))
    
    res.status(204).json({
        status: "success"
    })
})