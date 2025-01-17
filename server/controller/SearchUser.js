const UserModel = require("../model/userModel")


async function SearchUser (request,response){
  try {
    const {search}=request.body
    const query= new RegExp(search,"i","g")
    const user= await UserModel.find(
        {
            $or: [
                {name: query},
                {email: query}
                ]
                }

    ).select("-password")
    return response.json({
        message :'User Details',
        data:user,
        success :true
    })
  } catch (error) {
    return response.status(500).json({
        message :error.message || error,
        error: true
    })
  }  
}
module.exports= SearchUser