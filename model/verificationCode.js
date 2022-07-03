const mongoose = require("mongoose")

const codeSchema = new mongoose.Schema({

    code : {
        type : Number , 
        unique: true , 
        required:true
    }, 
    createdAt : {
        type: Date , 
        default: Date.now
    },
    userNumber: {
        type : Number ,  
        required: true , 
        unique:true
    }

})

module.exports = mongoose.model("verificationCode" , codeSchema)