const {Router} = require("express")
const router = Router()

const productController = require('../controller/productController')
const Auth = require('../controller/secure/authController')

router.route("/").get(productController.getAll)

router.use(Auth.protect)

router.route("/Create-Product").post(Auth.restrictTo('admin') ,productController.createProduct)

router.route('/:id')
.patch(Auth.restrictTo('admin') , productController.updateProduct)
.delete(Auth.restrictTo('admin') , productController.deleteProduct)
.get(productController.getById)

router.route('/:number').get(productController.getByNumber)

module.exports = router