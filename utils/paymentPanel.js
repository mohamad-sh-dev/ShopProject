const axios = require('axios'); 
class Payment {
    constructor() {
        this.MerchantID = process.env.MERCHANT_ID ;
        this.CallbackURL = `${req.protocol}://${req.get('host')}/api/v1/Payment` ;
        this.Description = 'Nothing to say for now';
        this.ToPaymentOperatorAccessUrl = process.env.TO_PAYMENT_OPERATOR_ACCESS_URL ;
        this.VerifyPaymentAccessUrl = process.env.VERIFY_PAYMENT_OPERATOR_ACCESS_URL ;
    }

    async toPay(amount) {
        const payload = {
            MerchantID: this.MerchantID ,
            Amount: amount ,
            CallbackURL: this.CallbackURL,
            Description: this.Description
        }
        return await axios.post(this.ToPaymentOperatorAccessUrl, payload)
    }
    async verifyPay (authority , amount) {
        const payload = {
            MerchantID: this.MerchantID ,
            Amount: amount ,
            Authority : authority
        }
        return await axios.post(this.ToPaymentOperatorAccessUrl, payload)
    }
}

module.exports = Payment