const express = require('express')
const mongoose = require('mongoose');
const {Server}=require('socket.io')
const http=require('http')
const UserDetailsFromToken = require('../helpers/UserDetailsFromToken')
const { set } = require('mongoose')
const UserModel = require('../model/userModel')
const {ConversationModel,MessageModel} = require('../model/ConversationModel')
const getConversation= require('../helpers/getConversation')
const app= express()
// socket connection establishment
const server=http.createServer(app)
const io= new Server(server,{
    cors: {
        origin : process.env.FRONTEND_URL,
        credentials : true
        }
})

// socket is running at http://localhost:8080/


// user active status
const onlineUser = new Set()

io.on('connection',async(socket)=>{
    console.log('user connected',socket.id)
    const token = socket.handshake.auth.token

  //  current user details 
    const user = await UserDetailsFromToken(token)
//    create a room
socket.join(user?._id?.toString())
onlineUser.add(user?._id?.toString())
io.emit('onlineUser',Array.from(onlineUser))

socket.on('message-page',async(userId)=>{
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error(`Invalid ObjectId: ${userId}`);
        return socket.emit('error', { message: 'Invalid user ID' });
      }
    console.log(userId)
    const userDetails=await UserModel.findById(userId).select("-password")
    if (!userDetails) {
        return socket.emit('error', { message: 'User not found' });
      }
    const payload={
        _id: userDetails?._id,
        name:userDetails?.name,
        email:userDetails?.email,
        profile_pic :userDetails.profile_pic,
        online: onlineUser.has(userId)
    }
    socket.emit('message-user',payload)

    // previous messages

    const getConvrsationMessage = await ConversationModel.findOne({
        "$or" :[
            {sender: user?._id,receiver:userId },
            {sender:userId,receiver: user?._id }
            ]
    }).populate('messages').sort({updatedAt:-1})

    socket.emit('message',getConvrsationMessage?.messages || [])
})



socket.on('new message',async(data)=>{
    console.log(data)
   
    let conversation= await ConversationModel.findOne({
        "$or" :[
            {sender: data?.sender,receiver: data?.receiver },
            {sender: data?.receiver,receiver: data?.sender }
        ]
    })
    
    if(!conversation){
        const createConversation = new ConversationModel({
            sender: data?.sender,
            receiver: data?.receiver,
            
    })
conversation = await createConversation.save()
}
const message= await MessageModel({
    text:data.text,
    imageUrl:data.imageUrl,
    videoUrl:data.videoUrl,
    msgByUserId:data?.msgByUserId,

})
const saveMessage= await message.save()

const updateConversation= await ConversationModel.updateOne({_id:conversation?._id},
    {
        "$push": {
            messages:saveMessage._id
            }
    }
)
const getConvrsationMessage = await ConversationModel.findOne({
    "$or" :[
        {sender: data?.sender,receiver: data?.receiver },
        {sender: data?.receiver,receiver: data?.sender }
        ]
}).populate('messages').sort({updatedAt:-1})
 io.to(data?.sender).emit('message',getConvrsationMessage?.messages ||[])
 io.to(data?.receiver).emit('message',getConvrsationMessage?.messages ||[])


//  send sidebar conversation which can bee seen on both side
const conversationSender= await getConversation(data?.sender)
const conversationReceiver= await getConversation(data?.receiver)
io.to(data?.sender).emit('conversation',conversationSender)
 io.to(data?.receiver).emit('conversation',conversationReceiver)

})

// get all users
socket.on('sidebar',async(currentUserId)=>{
    console.log("currentUserId",currentUserId)
   const conversation= await getConversation(currentUserId)
           socket.emit("conversation",conversation)

})


socket.on('seen',async(msgByUserId)=>{
    let conversation= await ConversationModel.findOne({
        "$or" :[
            {sender: user?._id,receiver: msgByUserId },
            {sender: msgByUserId,receiver: user?._id }
        ]
    })

    const conversationMessageId=conversation?.messages ||[]
    const updateMessages = await MessageModel.updateMany({
        _id:{"$in":conversationMessageId},
        msgByUserId:msgByUserId},
        {"$set":{seen:true}}
    )

const conversationSender= await getConversation(user?._id.toString())
const conversationReceiver= await getConversation(msgByUserId)
io.to(user?._id.toString()).emit('conversation',conversationSender)
 io.to(msgByUserId).emit('conversation',conversationReceiver)

})
//disconnect
socket.on('disconnect',()=>{
    onlineUser.delete(user?._id).toString()
    console.log('user disconnected',socket.id)
    })
})
module.exports={
    app,
    server
}