import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: 'String',
      required: true,
    },
    receiverId: {
      type: 'String',
      required: true,
    },
    messageContent: {
      type: 'String',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Add any additional fields specific to messages if needed
  },
  { timestamps: true }
);


const Message = mongoose.model('Message', messageSchema);
export default Message;
