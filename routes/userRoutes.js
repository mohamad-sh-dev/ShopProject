const {
    Router
} = require("express")
const UserController = require('../controller/userController')
const Auth = require('../controller/secure/authController')
const cors = require("cors")
const router = Router()

router.use(cors())
router.route('/').get(Auth.protect, Auth.restrictTo('admin') ,  UserController.getAllusers)
router.route('/:id').get(Auth.protect,Auth.restrictTo('admin') , UserController.getUser)
router.route('/login').post(Auth.login)
router.route('/login/email').post(Auth.loginWithEmail)
router.route('/register').post(Auth.signUp)
router.route('/register-by-number').post(Auth.createVerifyCode)
router.route('/register-by-number-check').post(Auth.checkVerifiyCode)

module.exports = router