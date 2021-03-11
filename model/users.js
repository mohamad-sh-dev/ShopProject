const mongoose = require("mongoose")
const bcrypt  = require("bcryptjs")
const validator = require("validator")


const userSchema = new mongoose.Schema({

    name : {
        type: String,
        required: [true , " ورود نام کاربر ضروری می باشد"],
        minlength: 3,
        maxlength: 10,
        trim: true 
    },
    number:{
        type : Number,
        required: [true , 'شماره تلفن کاربر ضروری می باشد'],
        unique : true,
        validate: [validator.isMobilePhone , 'لطفا فقط شماره تلفن وارد نمایید']
    },
    email:{
        type : String,
        unique:true,
        validate: [validator.isEmail , 'لطفا ایمیل خود را به درستی وارد نمایید']
    },
    password : {
        type: String , 
        required: [true , 'ورود رمز عبور ضروری می باشد'],
        min : 5
    },
    passwordConfirm : {
        type: String , 
        required: [true , 'ورود رمز عبور ضروری می باشد'],
        min: 5 ,
        validate: {
            validator : function (el) {
                return el === this.password
            },
            message: 'رمز های عبور همسان نیستند'
        }
    },
    photo: {
        type: String , 
        default: 'user-default'
    }

})


userSchema.pre("save" , async function (){
    await bcrypt.hash(this.password , 12 )
})


userSchema.statics.ComparePassword = async (enterdPassword , userPassword , next)=>{
    const Correct = await bcrypt.compare( enterdPassword , userPassword)
    if (Correct) next()    
}

const user = mongoose.model("User" , userSchema)
module.exports = user