import Message from "../models/Message.js";
import User from "../models/User.js";

export const createMessage = async (req, res) => {
  try {
    //console.log('cc')
    console.log('Creating message',req.body) 
    const { senderId, receiverId, messageContent } = req.body;
    // Retrieve sender and receiver user objects
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    // Create a new message document
    const newMessage = new Message({
      senderId: sender._id,
      receiverId: receiver._id,
      messageContent,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get messages
export const getMessages = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      console.log('senderId:', senderId);
      console.log('receiverId:', receiverId);

      if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ error: 'Invalid senderId or receiverId' });
      }
      // Retrieve messages between sender and receiver
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
// Get Conversations
export const getConversations = async (req, res) => {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
      }
      // Retrieve conversations for the user
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [{ senderId: userId }, { receiverId: userId }],
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$senderId", userId] },
                then: "$receiverId",
                else: "$senderId",
              },
            },
            senderId: { $first: "$senderId" },
            receiverId: { $first: "$receiverId" },
            messageContent: { $first: "$messageContent" },
            timestamp: { $first: "$timestamp" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
      ]);
      res.status(200).json(conversations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
