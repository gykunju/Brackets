import { BsStars } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { TbSend2 } from "react-icons/tb";
import { IoMdAttach, IoMdClose } from "react-icons/io";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { sendMessage, analyzeImage } from "../services/geminiService";

function Ai_Assistant() {
  const { brackets, units, content, events, supabase } = useUser();
  const [chats, setChats] = useState([
    {
      speaker: "ai",
      content:
        "Hello! I'm here to assist you with any questions or tasks related to your studies. Feel free to ask me anything, from summarizing lecture notes to generating study guides. I can also reference your brackets, units, and uploaded content!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Ref for the chat container
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when chats change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachedFile) return;

    const userMessage = inputMessage.trim();

    // Add user message to chat
    const newUserChat = {
      speaker: "user",
      content: userMessage,
      file: attachedFile ? attachedFile.name : null,
    };

    setChats((prev) => [...prev, newUserChat]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let aiResponse;

      // Build user context
      const userContext = {
        brackets,
        units,
        content,
        events,
      };

      // If there's an attached image, analyze it
      if (attachedFile && attachedFile.type.startsWith('image/')) {
        const imageAnalysis = await analyzeImage(
          attachedFile,
          userMessage || "Describe this image and extract any important information from it."
        );
        aiResponse = imageAnalysis;
      } else {
        // Regular text message with context
        aiResponse = await sendMessage(userMessage, chats, userContext);
      }

      // Add AI response to chat
      setChats((prev) => [
        ...prev,
        {
          speaker: "ai",
          content: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setChats((prev) => [
        ...prev,
        {
          speaker: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
    }
  };

  // Handle file attachment
  const handleFileAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only allow images for now
      if (file.type.startsWith('image/')) {
        setAttachedFile(file);
      } else {
        alert("Currently, only image files are supported for attachment.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col geist-font min-h-screen relative bg-gradient-to-b from-white to-stone-50/30 dark:from-stone-900 dark:to-stone-950 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center pt-6 pb-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20 transition-colors duration-300"
      >
        <div className="flex items-center gap-2">
          <BsStars size={24} className="text-lime-800 dark:text-lime-400" />
          <h1 className="geist-font wght-700 text-xl text-gray-900 dark:text-white">
            AI Assistant
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-stone-400">
            {isLoading ? "Thinking..." : "Online"}
          </span>
        </div>
      </motion.div>

      {/* Chats */}
      <div className="flex-1 flex flex-col gap-6 p-5 lg:px-20 xl:px-32 overflow-y-auto">
        {chats.map((chat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={index}
            className={`flex items-end gap-3 max-w-[94%] lg:max-w-[70%] ${
              chat.speaker === "user"
                ? "self-end flex-row-reverse"
                : "self-start flex-row"
            }`}
          >
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`flex-shrink-0 ${
                chat.speaker === "user" ? "ml-2" : "mr-2"
              }`}
            >
              {chat.speaker === "ai" ? (
                <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 dark:from-lime-900/20 dark:to-stone-900 border border-lime-200 dark:border-lime-900/30 shadow-sm">
                  <BsStars size={20} className="text-lime-800 dark:text-lime-400" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-gradient-to-br from-lime-800 to-lime-900 shadow-sm">
                  <LiaUser size={20} className="text-white" />
                </div>
              )}
            </motion.div>

            {/* Message */}
            <div
              className={`flex flex-col ${
                chat.speaker === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="text-sm text-gray-600 dark:text-stone-400 mb-1 px-1">
                {chat.speaker === "ai" ? "AI Assistant" : "You"}
              </span>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-2xl p-4 text-base ${
                  chat.speaker === "user"
                    ? "bg-lime-800 text-white shadow-sm"
                    : chat.error
                    ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 shadow-sm"
                    : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-200 shadow-sm"
                }`}
              >
                {chat.content}
                {chat.file && (
                  <div className="mt-2 text-sm opacity-75 flex items-center gap-1">
                    <IoMdAttach size={14} />
                    {chat.file}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-3 max-w-[94%] lg:max-w-[70%] self-start"
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 dark:from-lime-900/20 dark:to-stone-900 border border-lime-200 dark:border-lime-900/30 shadow-sm">
              <BsStars size={20} className="text-lime-800 dark:text-lime-400" />
            </div>
            <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-lime-800 dark:bg-lime-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-lime-800 dark:bg-lime-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-lime-800 dark:bg-lime-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} className="h-4" />
      </div>

      {/* Input Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky bottom-[84px] w-full px-4 py-3 bg-gradient-to-b from-white/80 to-white dark:from-stone-950/80 dark:to-stone-950 backdrop-blur-sm border-t border-stone-100 dark:border-stone-800 z-20 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto">
          {/* Attached file preview */}
          <AnimatePresence>
            {attachedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-900/30"
              >
                <IoMdAttach size={18} className="text-lime-800 dark:text-lime-400" />
                <span className="text-sm text-lime-900 dark:text-lime-200 flex-1 truncate">
                  {attachedFile.name}
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="p-1 hover:bg-lime-100 dark:hover:bg-lime-900/40 rounded transition-colors"
                >
                  <IoMdClose size={16} className="text-lime-800 dark:text-lime-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-lime-600 dark:hover:border-lime-600 focus-within:border-lime-600 focus-within:ring-1 focus-within:ring-lime-600 transition-all shadow-sm">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 p-3.5 text-base text-gray-900 dark:text-white bg-transparent focus:outline-none disabled:text-gray-400 dark:disabled:text-stone-600 placeholder:text-gray-400 dark:placeholder:text-stone-600"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAttach}
                accept="image/*"
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 mr-2 text-gray-500 dark:text-stone-400 hover:text-lime-700 dark:hover:text-lime-400 transition-colors disabled:opacity-50"
              >
                <IoMdAttach size={22} />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
              className="p-3.5 rounded-xl bg-lime-800 text-white hover:bg-lime-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbSend2 size={22} />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Ai_Assistant;
