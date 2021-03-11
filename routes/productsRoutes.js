const {Router} = require("express")
const router = Router()

const productController = require('../controller/productController')


router.route("/").get(productController.getAll)

router.route("/Create-Product").post(productController.createProduct)

router.route('/:number').get(productController.getByNumber)

router.route('/:id').patch(productController.updateProduct).delete(productController.deleteProduct)



 






module.exports = router