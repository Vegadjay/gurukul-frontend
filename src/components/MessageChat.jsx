import React, { useState, useEffect, useRef } from "react";
import { Send, X, Image, Paperclip, Smile, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { io } from "socket.io-client";

const MessageChat = ({ tutor, isOpen, onClose, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const newSocket = io("https://gurukul-backend-21h3.onrender.com", {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    // Get or create chat
    const fetchChat = async () => {
      try {
        const response = await axios.post(
          "https://gurukul-backend-21h3.onrender.com/api/chat",
          {
            participants: [currentUserId, tutor._id],
          },
          { withCredentials: true }
        );

        setChatId(response.data._id);
        fetchMessages(response.data._id);

        // Join the chat room
        newSocket.emit("joinRoom", { chatId: response.data._id });
      } catch (error) {
        console.error("Error creating/fetching chat:", error);
      }
    };

    fetchChat();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isOpen, currentUserId, tutor._id]);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `https://gurukul-backend-21h3.onrender.com/api/message/${chatId}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !socket || !chatId) return;

    // Emit message via socket
    socket.emit("sendMessage", {
      chatId,
      senderId: currentUserId,
      message: messageText,
    });

    // Optimistically update UI
    const newMessage = {
      _id: Date.now().toString(),
      chat: chatId,
      sender: currentUserId,
      content: messageText,
      createdAt: new Date(),
      isOptimistic: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-0 right-6 md:right-12 z-50 w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-t-xl overflow-hidden flex flex-col h-[500px] border border-gray-200 dark:border-gray-700">
            {/* Chat header */}
            <div className="bg-blue-600 dark:bg-blue-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative h-10 w-10 mr-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={tutor.profileImage}
                      alt={tutor.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">{tutor.username}</h3>
                  <p className="text-xs opacity-80">Online</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-white/20 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message._id || message.id}
                    className={`flex ${message.sender === currentUserId
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`max-w-[80%] rounded-lg p-3 ${message.sender === currentUserId
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-tl-none"
                        }`}
                    >
                      <p>{message.content || message.text}</p>
                      <p
                        className={`text-xs mt-1 ${message.sender === currentUserId
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                          }`}
                      >
                        {formatTime(message.createdAt || message.timestamp)}
                        {message.isOptimistic && " (Sending...)"}
                      </p>
                    </motion.div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 rounded-tl-none">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-end">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 min-h-[44px] max-h-32 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-2 text-gray-500 dark:text-gray-400">
                    <button
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => toast.info("Image upload coming soon")}
                    >
                      <Image className="h-5 w-5" />
                    </button>
                    <button
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => toast.info("Attachments coming soon")}
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`ml-3 h-10 w-10 rounded-full flex items-center justify-center transition-colors ${messageText.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageChat;