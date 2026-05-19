import prisma from "../lib/prisma.js";

// 🟢 1. GET ALL CHATS (INBOX LIST)
export const getChats = async (req, res) => {
  const tokenUserId = req.user.userId;

  if (!tokenUserId) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    // Loop ko optimized tarike se chalane ke liye Promise.all use karein taake crash na ho
    const detailedChats = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

        let receiver = null;
        if (receiverId) {
          receiver = await prisma.user.findUnique({
            where: { id: receiverId },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          });
        }

        return { ...chat, receiver };
      }),
    );

    res.status(200).json(detailedChats);
  } catch (err) {
    console.error("Error in getChats:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// 🟢 2. GET SINGLE CHAT (CHAT ROOM DISPLAY)

export const getChat = async (req, res) => {
  const tokenUserId = req.user.userId;
  const chatId = req.params.id;
  console.log(chatId, "chatId");
  console.log("token id ", tokenUserId);
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      // 404 dene ke bajaye clean empty state return karein taake frontend smoothly handles kare
      return res.status(200).json({
        id: chatId,
        messages: [],
        seenBy: [tokenUserId],
        receiver: null, // Ya agar receiver fetch kar sakte hain toh wo pass karein
        isEmptyPlaceholder: true,
      });
    }

    // Checking if already seen, else update cleanly
    if (!chat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          seenBy: {
            set: [...chat.seenBy, tokenUserId],
          },
        },
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in getChat:", err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// 🟢 3. ADD CHAT (SINGLE PAGE PAR JAB CLICK HO)
export const addChat = async (req, res) => {
  // Safe check: Ensure user exists on request object
  const tokenUserId = req.user?.userId || req.userId;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required!" });
  }

  // Self-chat protection check
  if (tokenUserId === receiverId) {
    return res
      .status(400)
      .json({ message: "Aap apne aap se chat shuru nahi kar sakte!" });
  }

  try {
    // 1. Check karo agar chat pehle se exist karti hai
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
      include: {
        users: {
          where: {
            id: {
              not: tokenUserId, // Sirf receiver ka data include hoga
            },
          },
        },
      },
    });

    // Agar chat mil gayi, toh response bhej do
    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // 2. Agar chat nahi milti, toh Nayi Chat create karo aur sath hi Receiver ka data include karo
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId], // Jisne chat shuru ki, usne to dekh li (Notification issue nahi aayega)
        users: {
          connect: [{ id: tokenUserId }, { id: receiverId }],
        },
      },
      include: {
        users: {
          where: {
            id: {
              not: tokenUserId, // Response mein sirf receiver ka data jayega
            },
          },
        },
      },
    });

    // Front-end ki aasani ke liye data structure uniform rakhein
    // Agar users array mein data hai to direct receiver property bana kar bhej sakte hain
    const chatResponse = {
      ...newChat,
      receiver: newChat.users[0] || null,
    };

    return res.status(200).json(chatResponse);
  } catch (err) {
    console.error("Error in addChat:", err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// Backend par jab read chat hit ho:
export const readChat = async (req, res) => {
  const tokenUserId = req.user.userId; // Jo user login hai
  const chatId = req.params.id;

  try {
    const currentChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: { hasSome: [tokenUserId] },
      },
    })
    
    if (!currentChat)
      return res.status(404).json({ message: "Chat not found" });

    // Agar user ne abhi tak seen nahi kiya tha, to uski ID push karein
    if (!currentChat.seenBy.includes(tokenUserId)) {
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          seenBy: {
            push: tokenUserId,
          },
        },
      });
    }

    res.status(200).json({ message: "Chat marked as read successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
