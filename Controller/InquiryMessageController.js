const inquiryModel = require('../Models/MessageModel.js')




const getInqiryMessages = async(req,res)=>{
    try{
        const allMessages = await inquiryModel.find().sort({createdAt:-1})
        res.status(200).json({message:"all inquiry messages fetched",data:allMessages})

    }
    catch(err){
        console.log(err.message)
    }
}

const insertInquiryMessage = async(req,res)=>{
    console.log(req.body)
    const {fullName,email,subject,message} = req.body 
try{
const newMessage = await inquiryModel.create({
    fullName,
    email,subject,
    message

})
console.log(newMessage)
res.status(200).json({message:"Inquiry sent successfully"})
}
catch(err){
    res.status(200).json({message:err.message})
    console.log(err.message)
}
}


const deleteInquiryMessage = async(req,res)=>{
    const {id} = req.params 
try{
const deletedMessage = await inquiryModel.findByIdAndDelete(id)
res.status(200).json({message:"inquiry message deleted successfully"})
}
catch(err){
    res.status(500).json({message:"server error"})
}
}

module.exports = {getInqiryMessages,insertInquiryMessage,deleteInquiryMessage}