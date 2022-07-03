const mongoose = require("mongoose")
const validator = require("validator")

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: Object,
            required: true,
        },
        Quantity: {
            type: Number,
            required: true
        }
    }],
    CreatedAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        number: {
            type: String,
            required: true,
            validate: [validator.isMobilePhone, 'لطفا فقط شماره تلفن وارد نمایید']

        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        }
    },
    isDeliver : {
        type: Boolean  , 
        default : false , 
    } ,

})

orderSchema.pre(/^find/ , function (next){
    this.populate({
        path : 'user' , 
        select : 'userId'
    })
    next()
})

module.exports = mongoose.model("Order" , orderSchema)