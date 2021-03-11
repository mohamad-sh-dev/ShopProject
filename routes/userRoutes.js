const {Router} = require("express")
const UserController = require('../controller/userController')
const router = Router()


router.route('/').get(UserController.getAllusers)
router.route('/register').post(UserController.createUser)

module.exports = router