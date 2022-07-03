const {Router} = require("express")
const router = Router()

const Auth = require('../controller/secure/authController')
const orderController = require("../controller/orderController")


router.route('/create-order').post(Auth.protect , orderController.setOrder)

router.route('/my-orders').get(Auth.protect , orderController.getMyOrders)


module.exports = router