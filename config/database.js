const mongoose = require("mongoose")


const DB = process.env.DATABASE_URI.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

const connection = async () => {
    try {

        const conn = mongoose.connect(DB, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex:true
        })
        console.log("Databse Connected")
    } catch (err) {
        if (err) {
            console.log(err);
            process.exit(1)
        }

    }
}
module.exports = connection