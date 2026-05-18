import prisma from "../lib/prisma.js";
import { getIO, users } from "../socket/socket.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.user.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    // 1. Check if chat exists and user belongs to it
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // 2. Create the message record
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // 3. Update reference on parent chat object
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId], 
        lastMessage: text,
      },
    });

    // 🎯 🔥 REAL-TIME TRIGGER: Explicit string casting to fix type mismatch
    // Dono side ko String() mein convert kiya taake strict comparison strictly pass ho
    const receiverId = chat.userIDs.find((id) => String(id) !== String(tokenUserId));
    
    console.log(`ℹ️ [Debug Server Log] Sender ID: ${tokenUserId} | Extracted Receiver ID: ${receiverId}`);

    const io = getIO();

    if (io && receiverId) {
      // Mapping lookup ko bhi String wrap kiya taake match confirm ho
      const targetSocketId = users[String(receiverId)];
      
      if (targetSocketId) {
        console.log(`🚀 Broadcasting raw message payload directly to socket: ${targetSocketId}`);
        
        // Dono patterns ko support rakhrahe hain taake client side safely render karein
        io.to(targetSocketId).emit("getMessage", message);
        io.to(targetSocketId).emit("chat-message", message);
      } else {
        console.log(`📡 Receiver ${receiverId} is offline inside current memory mapping. Saved to DB.`);
        console.log("Current Live Users Stack on Server:", users); // Yeh verify karega ke kaun kaun online hai
      }
    } else {
      console.log("⚠️ ReceiverId extract nahi ho saki ya Socket Server unavailable hai.");
    }

    res.status(200).json(message);
  } catch (err) {
    console.error("Error in addMessage:", err.message);
    res.status(500).json({ message: "Failed to add message! " + err.message });
  }
};