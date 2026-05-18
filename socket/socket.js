import { Server } from "socket.io";

// We now use an array of socket IDs for each userId to support multi-tabs smoothly
const users = {}; 
let ioInstance = null;

export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend Client URL
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
    transports: ["websocket", "polling"]
  });

  ioInstance.on("connection", (socket) => {
    console.log("⚡ New Tab Connected. Socket ID:", socket.id);

    // Identity Mapper Listener (Supports Multi-tab sessions)
    socket.on("register", (userId) => {
      if (userId) {
        const uIdStr = String(userId);
        
        // Agar user pehle se register nahi hai to khali array banayein
        if (!users[uIdStr]) {
          users[uIdStr] = [];
        }
        
        // Socket ID duplicate hone se bachaen aur array mein push karein
        if (!users[uIdStr].includes(socket.id)) {
          users[uIdStr].push(socket.id);
        }

        console.log(`✅ User Mapped -> [User: ${userId}] linked connections:`, users[uIdStr]);
        
        // Active users list broadcast (All active unique keys)
        ioInstance.emit("onlineUsers", Object.keys(users));
      }
    });

    // 🛠️ FIXED Client-to-Client Relay System (Loops through all active user socket instances)
    socket.on("sendMessage", ({ receiverId, data }) => {
      const targetSocketIds = users[String(receiverId)];
      
      // Checking if the target user array contains any active socket pipes
      if (targetSocketIds && targetSocketIds.length > 0) {
        console.log(`📩 Relaying client event to all active nodes (${targetSocketIds.length}) for user: ${receiverId}`);
        
        // Loop karke user ke har active tab ko message deliver karein taake instantaneous response mile
        targetSocketIds.forEach((socketId) => {
          ioInstance.to(socketId).emit("getMessage", data);
        });
      } else {
        console.log(`⚠️ User ${receiverId} is offline. Message buffered in DB.`);
      }
    });

    // Clean Session references properly upon closure
    socket.on("disconnect", () => {
      console.log("❌ Tab Closed/Disconnected:", socket.id);
      
      for (const userId in users) {
        // Find if this socket belongs to the current user's array
        if (users[userId].includes(socket.id)) {
          // Remove only this specific closed socket ID from the array
          users[userId] = users[userId].filter((id) => id !== socket.id);
          console.log(`🗑️ Connection cleaned. Remaining nodes for user ${userId}:`, users[userId]);

          // Agar user ke saare tabs ya connections band ho chuke hain, toh user ko object se delete karein
          if (users[userId].length === 0) {
            delete users[userId];
            console.log(`🚫 User ${userId} is now completely offline.`);
          }
          
          // Re-broadcast fresh updated online track map
          ioInstance.emit("onlineUsers", Object.keys(users));
          break;
        }
      }
    });
  });

  return ioInstance;
};

export const getIO = () => ioInstance;
export { users };