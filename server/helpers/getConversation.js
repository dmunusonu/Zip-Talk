const { ConversationModel } = require("../model/ConversationModel");

const getConversation = async (currentUserId) => {
    
  if (!currentUserId) return [];

  const users = await ConversationModel.find({
    "$or": [
      { sender: currentUserId },
      { receiver: currentUserId }
    ]
  })
    .sort({ updatedAt: -1 })
    .populate('messages')
    .populate('sender')
    .populate('receiver');

  console.log('currentUserConversation:', users);
  
  
  const conversations = users.map((conver) => {
    // Calculate unseen messages
    const unseenMsgCount = conver.messages.reduce((count, message) => {
        if (!message || !message.msgByUserId) return count; // Skip invalid messages
        const isUnseen = !message.seen && message.msgByUserId.toString() !== currentUserId;
        return count + (isUnseen ? 1 : 0);
      }, 0);
      


      
    // Determine the last message (if any)
    const lastMsg = conver.messages[conver.messages.length - 1] || null;

    return {
      _id: conver._id,
      sender: conver.sender,
      receiver: conver.receiver,
      unseenMsg: unseenMsgCount,
      lastMsg: lastMsg
    };
  });

  return conversations;
};

module.exports = getConversation;
