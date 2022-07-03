const ghasedak = require("ghasedak")

class SmsPanel {
    constructor(receptor, message) {
        this.message = message
        this.receptor = receptor || process.env.SMS_RECEPTOR;
        this.lineNumber = process.env.SMS_LINENUMBER
        this.operator = new ghasedak(process.env.SMS_API_KEY)
    }

    send() {
        try {
            this.operator.send({
                // !TODO   change this line to use ghasedak tamplate or create new method for it
                message: `کد فعال سازی شما : ${this.message} `,
                receptor: this.receptor,
                lineNumber: this.lineNumber
            })
        } catch (error) {
            console.log(error) ;
            throw error ;
        }
    }
}

module.exports = SmsPanel