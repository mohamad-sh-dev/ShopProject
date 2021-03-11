const {Router} = require("express")
const viewCrr = require("../controller/viewController")

const router = Router()


router.route("/").get(viewCrr.getAllProducts)


module.exports = router