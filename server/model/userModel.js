const mongoose=require('mongoose')

const userSchena= new mongoose.Schema({
    name:{type:String,required:[true,"Provide Name"]},
    email:{type:String,required:true,unique:true},
    password: {type:String,required:[true,"Provide Password"]},
    profile_pic:{type:String,default:''}
},
{
    timestamps:true

}
)
const UserModel=mongoose.model('User',userSchena)
module.exports= UserModel