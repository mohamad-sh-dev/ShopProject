const sendResponse = (data ,status , statusCode , res)=>{
    res.status(statusCode).json({
        status: status,
        result: data.length , 
        data 
    })
}
module.exports = sendResponse
