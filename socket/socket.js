import { Server } from "socket.io";

// Online users track karne ke liye
const users = {}; // { userId: socket.id }

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process?.env?.CLIENT_URL || "http://localhost:5173", // Fallback back laga diya safe side ke liye
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ 1. Register User (Online Status)
    socket.on("register", (userId) => {
      console.log("userid register ki bahi", userId);

      users[userId] = socket.id;

      io.emit("register", users); // Sabko updated online list bhejo
    });

    // ✅ 2. One-to-One Chat Message
    socket.on("chat-message", (data) => {
      console.log(data, "user ka data chats hai backend se ====");

      const { receiverId } = data;

      const targetSocketId = users[receiverId];

      // Receiver ko message bhejo (agar online hai)

      if (targetSocketId) {
        io.to(targetSocketId).emit("chat-message", data);
      }

      // Sender ko wapis confirmation bhejo
      socket.emit("chat-message", data);
    });

    // ✅ 3. User Disconnect
    socket.on("disconnect", () => {
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          io.emit("register", users); // Baki sabko batao ke user offline ho gaya
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export { users };
