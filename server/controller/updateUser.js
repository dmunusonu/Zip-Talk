const UserModel = require("../model/userModel")
const UserDetailsFromToken= require("../helpers/UserDetailsFromToken")
async function updateUser(request, response) {
    try {
        const token= request.cookies.token || ""
        const user = await UserDetailsFromToken(token)
const {name,email} = request.body

const updateUser = await UserModel.updateOne({_id : user._id},
    {
        name,
        email
    }
)
const userInformation = await UserModel.findById(user._id)
 return response.json({
    message : "user updated successfully",
    data : userInformation,
    success : true
 })
        
    } catch (error) {
        return response.status(500).json({
            message: 'Error updating user' || error,
            error : true
        })
    }
    
}
module.exports= updateUser