const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    user: {

        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    products: {
        productItem: [{
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        }]
    },
    Date: {
        type: Date,
        default: Date.now(),
    },
    amount: {
        type: Number,
        required: true,
    },
    resAuthority: {
        type: String,
        required: true,
    },
    isPay: {
        type: Boolean,
        default: false
    },

})

paymentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
    })
    next()
})




module.exports = mongoose.model("Payment", paymentSchema)