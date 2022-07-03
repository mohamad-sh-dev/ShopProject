const mongoose = require("mongoose")

const Product = require("./products")
const User = require("./users")

const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        max: 5.0,
        min: 1.0,
        // set: value => Math.round(value * 10) / 10
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // for show in rendered page 1 
    isShow:{
        type:Boolean , 
        default:false
    }, 
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: Product , 
        required: true
    }

})

// populate property of user
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "userId",
        select: 'name photo -_id'
    })
    next()
})

const Reviews = mongoose.model("Reviews" , reviewSchema)
module.exports = Reviews
