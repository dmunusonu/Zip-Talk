const UserModel=require('../model/userModel')

async function checkEmail(request,response) {
    try {
        const {email} = request.body
        const checkEmail=await UserModel.findOne({email}).select("-password")
        if (!checkEmail) {
            return response.status(400).json({
                message: 'Email Does not exists', error: true})
    } 
   return response.status(200).json({
    message: 'Email verified', sucess: true, data : checkEmail})
}
    catch (error) {
        return response.status(500).json({
            message: error.message|| error,
            error :true
        })
    }
    
}
module.exports=checkEmail