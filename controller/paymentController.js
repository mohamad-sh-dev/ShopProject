const path = require('path') ;

const PaymentModel = require("../model/payment")
const PaymentPanel = require("../utils/paymentPanel")
const catchAsync = require("../utils/cathAsync");


const sendResponse = (message, statusCode, status, res) => {
    return res.status(statusCode).json({
        status: status,
        message: message
    })
}

const PaymentService = new PaymentPanel()
exports.payment = catchAsync(async (req, res, next) => {
    let total = 0;
    const products = {
        productItem : []
    };
    
    const user = await req.user.populate('cart.items.productId').execPopulate();
    userProducts = await user.cart.items;
    if (userProducts.lenght <= 0) {
        return new AppError('محصولی برای پرداخت وجود ندارد', 400);
    };
    userProducts.forEach((p) => {
        total += p.Quantity * p.productId.price
        products.productItem.push({
            productId: p.productId.id,
        });
    });

    const toPay = await PaymentService.toPay(total)
    if (toPay.data.Status === 100) {
        const payment = new PaymentModel({
            user: req.user.id,
            products: products,
            amount: total,
            resAuthority: toPay.data.Authority
        })
        await payment.save({
            validateBeforeSave: false
        })
        res.redirect(`${process.env.REDIRECT_URL}${path.sep}${toPay.data.Authority}`)
    } else {
        res.status(400).json({
            status: "fail",
            message: "ارتباط ناموفق"
        })
    }
})
exports.paymentresult = catchAsync(async (req, res, next) => {
    if (req.query.Status && req.query.Status !== "OK") {
        return sendResponse("تراکنش ناموفق", 400, "failed", res)
    }
    const paymentInformation = await Payment.findOne({
        resAuthority: req.query.Authority
    })
    if (!paymentInformation) {
        return sendResponse("چنین تراکنشی موجود نمیباشد", 400, "not found", res)
    }
    const response = await PaymentService.verifyPay(req.query.Authority , paymentInformation.amount)
    if (response.data.Status === 100) {
        paymentInformation.isPay = true;
        paymentInformation.products.productItem.forEach((p) => {
            p['isPay'] = true
        })
        await payment.save()
        sendResponse("عملیات پرداخت شما با موفقیت انجام شد", 200, "success", res)
    }
})