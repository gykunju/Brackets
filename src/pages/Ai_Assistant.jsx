import { BsStars } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { FiSend } from "react-icons/fi";
import { IoMdAttach } from "react-icons/io";
import { TbSend2 } from "react-icons/tb";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

function Ai_Assistant() {
  const chats = [
    {
      speaker: "ai",
      content:
        "Hello! I/'m here to assist you with any questions or tasks related to your studies. Feel free to ask me anything, from summarizing lecture notes to generating study guides.",
    },
    {
      speaker: "user",
      content:
        "Hello! Can you Give me a work plan based on the content im doing in semester 1.",
    },
    {
      speaker: "ai",
      content:
        "Sure. Are there any specific restrictions or preferred times you would like me to give priority to?",
    },
    {
      speaker: "user",
      content: "eyeball it for me",
    },
    {
      speaker: "user",
      content: "eyeball it for me",
    },
    {
      speaker: "user",
      content: "eyeball it for me",
    },
  ];

  // Ref for the chat container
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when chats change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col geist-font min-h-screen relative bg-gradient-to-b from-white to-stone-50/30 pb-20"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center pt-6 pb-4 bg-white/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 z-20"
      >
        <div className="flex items-center gap-2">
          <BsStars size={24} className="text-lime-800" />
          <h1 className="geist-font wght-700 text-xl text-gray-900">
            AI Assistant
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </motion.div>

      {/* chats */}
      <div className="flex-1 flex flex-col gap-6 p-5 lg:px-20 xl:px-32 overflow-y-auto">
        {chats.map((chat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
                <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200 shadow-sm">
                  <BsStars size={20} className="text-lime-800" />
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
              <span className="text-sm text-gray-600 mb-1 px-1">
                {chat.speaker === "ai" ? "AI Assistant" : "You"}
              </span>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-2xl p-4 text-base ${
                  chat.speaker === "user"
                    ? "bg-lime-800 text-white shadow-sm"
                    : "bg-white border border-stone-200 shadow-sm"
                }`}
              >
                {chat.content}
              </motion.div>
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} className="h-4" />
      </div>

      {/* text box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky bottom-[84px] w-full px-4 py-3 bg-gradient-to-b from-white/80 to-white backdrop-blur-sm border-t border-stone-100 z-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border border-stone-200 hover:border-lime-600 focus-within:border-lime-600 focus-within:ring-1 focus-within:ring-lime-600 transition-all shadow-sm">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3.5 text-base text-gray-900 bg-transparent focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 mr-2 text-gray-500 hover:text-lime-700 transition-colors"
              >
                <IoMdAttach size={22} />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3.5 rounded-xl bg-lime-800 text-white hover:bg-lime-700 transition-colors shadow-sm"
            >
              <TbSend2 size={22} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Ai_Assistant;
