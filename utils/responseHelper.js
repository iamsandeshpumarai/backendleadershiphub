
//error handler
const errorHandler = (res,status=500,message,error=null)=>{
    res.status(status).json({
        success:false,
        message,
        error,
        timeStamp:new Date()

    })
}

//data handler 

const dataHandler = (res,status=200,message="",data=[])=>{
    res.status(status).json({
        success:true,
        message,
        data,
        timeStamp: new Date()
    })
}

module.exports = {errorHandler,dataHandler}
