const {Router} = require("express")
const router = Router()

const Auth = require('../controller/secure/authController')
const cartController = require("../controller/cartController")


router.route('/').get( Auth.protect ,cartController.getCheckOut)
router.route('/').delete( Auth.protect ,cartController.clearCart)

router.route('/:id').post( Auth.protect ,cartController.addtoCart)
router.route('/:id').delete( Auth.protect ,cartController.removerFromCart)

router.route('/quantity/:id').post( Auth.protect ,cartController.decreaseQuantity)


module.exports = router