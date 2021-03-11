const path = require("path")
const  express =require ('express')

const morgan = require("morgan")
const exprLayyout = require ("express-ejs-layouts")
const bodyParser = require("body-parser")
const dotEnv = require("dotenv")
const ErrorGlobal = require("./controller/errorCotroller");

const app = express()


// dotenv config
dotEnv.config({
    path: "./config/config.env"
})

// connection DB
const database = require("./config/database")
database()

// Morgan Config
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"),)
}

// Handlle Errors



// Body Parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


// Set static Folder 

app.use(express.static(path.join(__dirname, "public")))

// Set View Engine
app.use(exprLayyout)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.set("layout", "./layouts/mainlayout.ejs")

// Routes
app.use("/api/v1/Products" ,require("./routes/productsRoutes"))
app.use("/api/v1/Users" ,require("./routes/userRoutes"))
app.use("/" ,require("./routes/viewRoutes"))
app.use(ErrorGlobal)


// Server 
const port = process.env.PORT
app.listen(port , console.log(`Server is runing on port ${port}`))