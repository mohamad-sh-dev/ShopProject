const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "محصول باید نام داشته باشد"],
    },
    number:{
        type:Number,
        required:[true,'محصول باید شماره داشته باشد'],
        unique : true
    },
    summary: {
        type: String,
        required: [true, "محصول باید توضیح کوتاه داشته باشد"]
    },
    description: {
        type: String,
        required: [true, "محصول باید دارای توضیحات باشد"],
        minlength: 10
    },
    imageCover: {
        type: String,
        required: [true, "محصول باید تصویر زمینه داشته باشد"],
    },
    images: [String],

    price:{
        type:Number,
        required:[true, "محصول باید قیمت مشخص داشته باشد"]
    },
    buyers :[{
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    }],

    rantingAverage: {
        type: Number,
        default: 4.0,
        max: [5.0, "امتیاز محصول نمیتواند بیشتراز 5.0 باشد"],
        min: [1.0, "امتیاز محصول نمیتواند کمتر از 1.0 باشد"],
        set: val => Math.round(val * 10) / 10
    },
},{
    toJSON: {
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})

module.exports = mongoose.model("Products", productSchema)