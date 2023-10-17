const jwt = require("jsonwebtoken")
const {
    promisify
} = require("util")
const crypto = require("crypto")

const User = require("../../model/users")
const AppError = require('../../utils/appErrors')
const catchAsync = require('../../utils/cathAsync')

console.log(process.env.JWT_SECRET);
const signToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true

    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true
    res.cookie("jwt", token, cookieOptions)
    res.status(statusCode).json({
        status: "success",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            number: user.number
        },
        token
    })

}

exports.signUp = catchAsync(async (req, res, next) => {
    const {
        number,
        email
    } = req.body
    const duplicateUser = await User.findOne({
        email,
        number
    });
    if (duplicateUser) {
        return next(new AppError('کاربر تکراری است', 400));
    }
    const newUser = await User.create(req.body)
    // send welcome email 
    // const url = `${req.protocol}://${req.get("host")}/login`
    // await new Email(newUser,url).sendWelcome()

    //Create Token For User with Jwt
    createSendToken(newUser, 201, res)
})
exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        number,
        password
    } = req.body
    //check if email or password entered
    if (!password || !number) {
        return next(new AppError("لطفا ایمیل یا شماره و رمز عبور خود را وارد کنید"), 401)
    }
    // Find User in database with email 
    const user = await User.findOne({
        number
    }).select('+password')
    console.log(user);
    //check user exist and password is Correct !
    if (!user || !(await user.ComparePassword(password, user.password))) {
        console.log('hi');
        return next(new AppError('شماره یا رمز عبور وارد شده صحیح نمیباشد', 401))
    }
    createSendToken(user, 200, res)
})
exports.loginWithEmail = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body
    if (!email || !password) {
        return next(new AppError("لطفا ایمیل و رمز عبور خود را وارد کنید"))
    }
    const user = await User.findOne({
        email: email
    }).select('+password')
    if (!user || !(await user.ComparePassword(password, user.password))) {
        return next(new AppError('ایمیل یا رمز عبور وارد شده صحیح نمیباشد'))
    }
    createSendToken(user, 200, res)
})
exports.logOut = (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        status: "success"
    })
}
exports.protect = catchAsync(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]

        // }else if (req.cookies.jwt) {
        //     token = res.cookies.jwt
        //     if(req.cookies.jwt === undefined) {
        //         return next(new AppError('You are not logged in !', 401))
        //     }
    }
    if (!token || token === undefined) {
        return next(new AppError('You are not logged in !', 401))
    };
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError("this user no longer exist!", 401))
    }

    // if (currentUser.passwordChangedAfter(decoded.iat)) {
    //     return next(new AppError("Password was Changed Please Relog in ", 401))
    // }

    //Grant access if All Conditions true !
    req.user = currentUser
    res.locals.user = currentUser // for access to user in rendered Pages
    next()
})
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("شما اجازه دسترسی به این قسمت را ندارید!", 403))
        }
        next()
    }
}
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
        number: req.body.number
    })
    if (!user) {
        return next(new AppError("کاربری با این ایمیل وجود ندارد!", 404))
    }
    const resetToken = user.setPasswordResetToken();
    await user.save({
        validateBeforeSave: false
    })
    const resetUrl = `${req.protocol}//:${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    try {
        new Email(user, resetUrl).sendResetPassword()
        res.status(200).json({
            status: "success",
            message: "لینک مورد نظر برای ایمیل شما ارسال شد"
        })
    } catch (err) {
        console.log(err);
        user.passwordResetToken = undefined
        user.passwordResetTimer = undefined
        await user.save({
            validateBeforeSave: false
        })
        return next(new AppError("مشکلی به وجود آمده لطفا مجددا تلاش نمایید", 500))
    }
})
exports.resetPassword = catchAsync(async (req, res, next) => {
    // Find User In Database By Hashed Token 
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTimer: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new AppError("لینک معتبر نیست یا منقضی شده است لطفا مجدد تلاش کنید", 400))
    }
    // 2) Set New Password For User
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetTimer = undefined
    await user.save()

    createSendToken(user, 201, res)
});
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError("کلمه عبور صحیح نمیباشد"))
    }
    user.password = req.body.password
    await user.save()
    createSendToken(user, 201, res)
})