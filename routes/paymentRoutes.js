const {Router} = require("express")
const router = Router()

const Auth = require('../controller/secure/authController')
const paymentController = require("../controller/paymentController")


router.route('/').post(Auth.protect , paymentController.payment)
// router.route("/cb").get(Auth.protect , paymentController.cb)


module.exports = router