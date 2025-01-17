const { trusted } = require("mongoose");
const UserModel = require("../model/userModel");
const bcryptjs=require('bcryptjs')
async function RegisterUser(request,response) {
    try {
        const { name, email, password,profile_pic } = request.body;
        const CheckEmail= await UserModel.findOne({email});
        if (CheckEmail) {
            return response.status(400).json({
                message: "Email already exists",
                error:true
            })
        }

const secure = await bcryptjs.genSalt(10)
const hashPassword = await bcryptjs.hash(password, secure);

   const payload = {
    name,
    email,
    password:hashPassword,
    profile_pic
    
   }
   const user = await UserModel.create(payload);
   const UserSave= await user.save()

return response.status(201).json({
    message: "User Account created successfully",
    data :UserSave,
    success :true
})

    } catch (error) {
        return response.status(500).json({
            message: error.message||error,
             error :true
        })
    }
}
module.exports= RegisterUser