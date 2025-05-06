import React, { useState, useEffect, useRef } from "react";
import { Send, MoreVertical, Paperclip, Smile, ArrowLeft, X, Image, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";

import socketIO from 'socket.io-client';
import { useLocation, useNavigate } from "react-router-dom";

const socket = socketIO.connect('http://localhost:5000');

// Enhanced animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        },
    },
};

const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 110, damping: 14 }
    },
};

const messageItemVariants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 25
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 130,
            damping: 14
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: -10,
        transition: { duration: 0.2 }
    }
};

const inputBarVariants = {
    rest: {
        scale: 1,
        boxShadow: "0px 0px 0px rgba(59, 130, 246, 0)"
    },
    focus: {
        scale: 1.02,
        boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.3)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17
        }
    }
};

const buttonVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.12,
        rotate: 5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
};

const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

// Enhanced typing indicator with better animation
const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-20 shadow-sm">
        <motion.div
            className="h-2.5 w-2.5 bg-gray-500 dark:bg-gray-300 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "loop", times: [0, 0.5, 1] }}
        />
        <motion.div
            className="h-2.5 w-2.5 bg-gray-500 dark:bg-gray-300 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "loop", times: [0, 0.5, 1], delay: 0.2 }}
        />
        <motion.div
            className="h-2.5 w-2.5 bg-gray-500 dark:bg-gray-300 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "loop", times: [0, 0.5, 1], delay: 0.4 }}
        />
    </div>
);

const MessagingPage = () => {
    const path = useLocation();
    const navigate = useNavigate();
    const id = path.pathname.split("/")[2];
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const messageInputRef = useRef(null);
    const role = localStorage.getItem("role");
    const currentUserData = JSON.parse(localStorage.getItem("user"));
    const [activeConversation, setActiveConversation] = useState({ id: id, username: "someone" });
    const currentUser = {
        id: currentUserData?._id
    };

    let chatId = "";

    if (role == "student") {
        chatId = `${activeConversation.id}-${currentUser.id}`;
    }
    else if (role == "guru") {
        chatId = `${currentUser.id}-${activeConversation.id}`;
    }

    // Check for screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const getPreviousMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat/getchat?guruId=${role === "guru" ? currentUser.id : activeConversation.id}&studentId=${role === "student" ? currentUser.id : activeConversation.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                // Add animation delay for staggered entrance
                const messagesWithDelay = data.data.messages.map((msg, index) => ({
                    ...msg,
                    animationDelay: index * 60 // ms delay for staggered animation
                }));
                setMessages(messagesWithDelay);
                setActiveConversation({
                    ...activeConversation,
                    username: role === "guru" ? data.data.student.username : data.data.guru.username
                });
            } else {
                toast.error("Failed to fetch messages.");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Error fetching messages.");
        }
    }

    useEffect(() => {
        socket.emit('joinRoom', { chatId: chatId });

        socket.on('receiveMessage', (messageData) => {
            // Add subtle animation effect for incoming messages
            const enhancedMessage = {
                ...messageData,
                animationDelay: 0,
                highlight: true
            };
            setMessages((prev) => [...prev, enhancedMessage]);

            // Notification effect for new messages when not focused
            if (document.hidden) {
                // Could add notification here
                document.title = "New message! - Guru Chat";
                // Reset title when focus returns to window
                const resetTitle = () => {
                    document.title = "Guru Chat";
                    window.removeEventListener('focus', resetTitle);
                };
                window.addEventListener('focus', resetTitle);
            }
        });

        socket.on('userTyping', () => {
            setIsTyping(true);
            // Auto-hide typing indicator after 3 seconds
            setTimeout(() => setIsTyping(false), 3000);
        });

        getPreviousMessages();
        return () => {
            socket.off('receiveMessage');
            socket.off('userTyping');
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const saveChat = async (guruId, studentId, sender, message) => {
        try {
            const response = await fetch("http://localhost:5000/api/chat/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    guruId: guruId,
                    studentId: studentId,
                    sender: sender,
                    message: message
                }),
            });
            const data = await response.json();
            if (!data.success) {
                toast.error("Failed to save chat.");
            }
        } catch (error) {
            console.error("Error saving chat:", error);
            toast.error("Error saving chat.");
        }
    }

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        const newMsg = {
            id: `temp-${Date.now()}`,
            sender: role,
            message: newMessage,
            timestamp: new Date().toISOString(),
            isNew: true // Flag for special animation
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage("");
        setShowEmojiPicker(false);
        setShowOptions(false);

        // Emit to server
        socket.emit('sendMessage', {
            chatId: chatId,
            senderId: currentUser.id,
            message: newMessage,
        });

        if (role == "student") {
            saveChat(activeConversation.id, currentUser.id, "student", newMessage);
        }
        else if (role == "guru") {
            saveChat(currentUser.id, activeConversation.id, "guru", newMessage);
        }

        // Simulate local delivery confirmation
        setTimeout(() => {
            setMessages(prevMsgs =>
                prevMsgs.map(msg =>
                    msg.id === newMsg.id ? { ...msg, delivered: true } : msg
                )
            );
        }, 1000);
    };

    const handleEmojiClick = (emojiObject) => {
        setNewMessage(prev => prev + emojiObject.emoji);
        messageInputRef.current.focus();
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        socket.emit('typing', { chatId: chatId });
    };

    const goBack = () => {
        navigate(-1);
    };

    const timestampsToTimeOnly = (time) => {
        const date = new Date(time);
        if (isNaN(date.getTime())) {
            return "";
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <motion.div
            className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col p-0 sm:p-3 md:p-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-none sm:rounded-2xl mx-auto max-w-5xl w-full"
                variants={itemVariants}
            >
                {/* Chat Header */}
                <motion.div
                    className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 sticky top-0 z-10 rounded-t-none sm:rounded-t-2xl"
                    whileHover={{ backgroundColor: isSmallScreen ? '#ffffff' : '#f9fafb' }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={goBack}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </motion.button>
                        <motion.div
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-lg shadow-md">
                                    {activeConversation.username ? activeConversation.username.charAt(0).toUpperCase() : "?"}
                                </div>
                                <motion.div
                                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            </div>
                            <div>
                                <motion.h2
                                    className="font-semibold text-gray-900 font-poppins dark:text-white text-lg truncate max-w-[140px] sm:max-w-full"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {activeConversation.username ?? "someone"}
                                </motion.h2>
                                <motion.p
                                    className="text-xs text-green-500 dark:text-green-400 font-poppins"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {"Online now"}
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <motion.button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Mic className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </motion.button>
                        <motion.button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Messages */}
                <motion.div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-3 py-6 sm:px-5 md:px-8 bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
                    style={{ height: "calc(100vh - 160px)" }}
                    variants={fadeInVariants}
                >
                    <div className="flex flex-col space-y-4">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={`${message.id}-${index}`}
                                    className={`flex ${message.sender == role ? "justify-end" : "justify-start"} px-1`}
                                    variants={messageItemVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    custom={index}
                                    transition={{ delay: message.animationDelay ? message.animationDelay / 1000 : 0 }}
                                >
                                    <motion.div
                                        className={`font-poppins px-4 py-3 rounded-2xl max-w-xs sm:max-w-md lg:max-w-lg break-words ${message.sender === role
                                            ? "bg-blue-500 text-white rounded-br-none shadow-md"
                                            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none shadow-md"
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        initial={message.isNew ? { scale: 0.9, opacity: 0.5 } : {}}
                                        animate={message.isNew ?
                                            { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500 } } :
                                            {}
                                        }
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <p className="text-[15px] leading-relaxed">{message.message}</p>
                                        <div
                                            className={`text-xs mt-1.5 flex justify-end font-inter items-center ${message.sender === role
                                                ? "text-blue-100"
                                                : "text-gray-500 dark:text-gray-400"
                                                }`}
                                        >
                                            {timestampsToTimeOnly(message.timestamp)}
                                            {message.sender === role && message.delivered && (
                                                <motion.svg
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="ml-1 h-3 w-3"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </motion.svg>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                className="flex justify-start ml-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <TypingIndicator />
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </motion.div>

                {/* Message Input */}
                <motion.div
                    className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800 sticky bottom-0 rounded-b-none sm:rounded-b-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                >
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <AnimatePresence>
                            {showOptions && (
                                <motion.div
                                    className="absolute bottom-16 left-4 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-3 flex space-x-3"
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <motion.button
                                        type="button"
                                        className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Image className="h-5 w-5" />
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="p-2 bg-red-100 dark:bg-red-800 rounded-full text-red-600 dark:text-red-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Mic className="h-5 w-5" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="button"
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
                            onClick={() => setShowOptions(!showOptions)}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Paperclip className="h-5 w-5" />
                        </motion.button>

                        <motion.div
                            className="flex-1 mx-2"
                            variants={inputBarVariants}
                            animate={inputFocused ? "focus" : "rest"}
                        >
                            <input
                                ref={messageInputRef}
                                type="text"
                                placeholder="Type a message..."
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-full py-3 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={newMessage}
                                onChange={handleInputChange}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                            />
                        </motion.div>

                        <div className="relative">
                            <motion.button
                                type="button"
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Smile className="h-5 w-5" />
                            </motion.button>
                            <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div
                                        className="absolute bottom-12 right-0 z-10 shadow-lg"
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="relative">
                                            <motion.button
                                                className="absolute top-2 right-2 p-1 bg-gray-200 dark:bg-gray-600 rounded-full z-20 text-gray-600 dark:text-gray-300"
                                                onClick={() => setShowEmojiPicker(false)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <X className="h-4 w-4" />
                                            </motion.button>
                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            type="submit"
                            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            disabled={!newMessage.trim()}
                            variants={buttonVariants}
                            whileHover={newMessage.trim() ? "hover" : "rest"}
                            whileTap={newMessage.trim() ? "tap" : "rest"}
                            animate={{
                                backgroundColor: newMessage.trim() ? "#3b82f6" : "#93c5fd",
                                scale: newMessage.trim() ? 1 : 0.95
                            }}
                        >
                            <Send className="h-5 w-5" />
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default MessagingPage;