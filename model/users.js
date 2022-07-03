const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const Product = require('./products')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, " ورود نام کاربر ضروری می باشد"],
        minlength: 3,
        toLowerCase: true,
        trim: true
    },
    number: {
        type: Number,
        required: [true, 'شماره تلفن کاربر ضروری می باشد'],
        unique: true,

    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, 'لطفا ایمیل خود را به درستی وارد نمایید'],
        required: false
    },
    password: {
        type: String,
        required: [true, 'ورود رمز عبور ضروری می باشد'],
        minlength: 5,

    },
    passwordConfirm: {
        type: String,
        required: [true, 'لطفا تکرار رمز عبور را وارد نمایید'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'رمز های عبور شما نا همسان هستند'
        }
    },
    photo: {
        type: String,
        default: 'user-default'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
            Quantity: {
                type: Number,
                required: true
            }
        }]
    },
    balance: {
        type: Number,
        default: 0
    },
    payments: {
        type: mongoose.Schema.ObjectId,
        ref: "Payment"
    }

})


userSchema.methods.addToCart = async function (product) {
    // find product id exist in database and compare with this.cart.items => if true return index
    // this is for when user have product in his cart already
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString()

    })
    let newQuantity = 1
    // get Copy of cart items when have no product
    const UpdatedCartItems = [...this.cart.items]
    // if user cart have proudct then quantity of this product + 1 and calculate total Price and save to db
    if (cartProductIndex >= 0) {
        //cal Quantity
        newQuantity = this.cart.items[cartProductIndex].Quantity + 1
        UpdatedCartItems[cartProductIndex].Quantity = newQuantity;
        // cal total price 
        // totalPrice = UpdatedCartItems[cartProductIndex].productPrice * UpdatedCartItems[cartProductIndex].Quantity
        // UpdatedCartItems[cartProductIndex].productPrice = totalPrice

    } else {
        // console.log(product.title);
        // if user have no product in his cart then push new product to his cart 
        UpdatedCartItems.push({
            productId: product._id,
            Quantity: newQuantity,
            // productPrice : product.price ,
            // productName : product.title
        })
    }
    // set items 
    const updatedCart = {
        items: UpdatedCartItems
    };
    // set cart 
    this.cart = updatedCart;
    //save to db
    return this.save({
        validateBeforeSave: false
    })

}

userSchema.methods.removedFromCart = function (productId) {
    // filter on cart items to remove entered productId from cart.items 
    const UpdatedCartitems = this.cart.items.filter((i) => {
        return i.productId.toString() !== productId.toString()

    })
    this.cart.items = UpdatedCartitems;
    return this.save({
        validateBeforeSave: false
    })
}

userSchema.methods.decreaseQuantity = function (productId) {

    for (pro of this.cart.items)
        if (pro.productId == productId) {
            if (pro.Quantity == 1 || pro.Quantity == 0) {
                return this.save({
                    validateBeforeSave: false
                })
            } else {
                pro.Quantity = pro.Quantity - 1
                console.log(pro.Quantity);
                return this.save({
                    validateBeforeSave: false
                })
            }
        }

}
// remove User Card items 
userSchema.methods.clearCart = function () {
    const clear = []
    this.cart.items = clear
    return this.save()
}

// Password Compare Method !
userSchema.methods.ComparePassword = async (enterdPassword, userPassword, next) => {
    const test = await bcrypt.compare(enterdPassword, userPassword)
    return test;

}
// hash password and save to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});



const user = mongoose.model("User", userSchema)
module.exports = user