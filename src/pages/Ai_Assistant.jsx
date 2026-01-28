import { BsStars } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { TbSend2 } from "react-icons/tb";
import { IoMdAttach, IoMdClose } from "react-icons/io";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { sendMessage, analyzeImage, analyzeVisualPDF } from "../services/aiService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

      // If there's an attached image or PDF, analyze it
      if (attachedFile) {
        if (attachedFile.type.startsWith('image/')) {
          const imageAnalysis = await analyzeImage(
             attachedFile,
             userMessage || "Describe this image and extract any important information from it."
          );
          aiResponse = imageAnalysis;
        } else if (attachedFile.type === 'application/pdf') {
           const pdfAnalysis = await analyzeVisualPDF(
             attachedFile,
             userMessage || "Describe the contents of this PDF document."
           );
           aiResponse = pdfAnalysis;
        }
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
      // Allow images and PDFs
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setAttachedFile(file);
      } else {
        alert("Currently, only image and PDF files are supported for direct attachment.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col geist-font min-h-screen relative bg-gradient-to-b from-white to-stone-50/30 dark:from-stone-900 dark:to-stone-950 pb-20"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center pt-6 pb-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20"
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
            className={`flex items-end gap-3 max-w-[94%] lg:max-w-[70%] ${chat.speaker === "user"
                ? "self-end flex-row-reverse"
                : "self-start flex-row"
              }`}
          >
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`flex-shrink-0 ${chat.speaker === "user" ? "ml-2" : "mr-2"
                }`}
            >
              {chat.speaker === "ai" ? (
                <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border border-lime-200 dark:border-lime-900 shadow-sm">
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
              className={`flex flex-col ${chat.speaker === "user" ? "items-end" : "items-start"
                }`}
            >
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1 px-1">
                {chat.speaker === "ai" ? "AI Assistant" : "You"}
              </span>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`rounded-2xl p-4 text-base ${chat.speaker === "user"
                    ? "bg-lime-800 text-white shadow-sm"
                    : chat.error
                      ? "bg-red-50 border border-red-200 text-red-800 shadow-sm"
                      : chat.error
                        ? "bg-red-50 border border-red-200 text-red-800 shadow-sm"
                        : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm dark:text-gray-100"
                  }`}
              >
                <div className={`prose dark:prose-invert max-w-none ${chat.speaker === "user" ? "prose-p:text-white prose-headings:text-white prose-li:text-white prose-strong:text-white" : ""}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      a: ({node, ...props}) => <a className="underline hover:text-lime-600 dark:hover:text-lime-400 font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      code: ({node, inline, className, children, ...props}) => {
                        return inline ? (
                          <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-sm font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <div className="bg-stone-900 text-stone-100 rounded-lg p-3 my-2 overflow-x-auto border border-stone-800">
                             <code className="font-mono text-sm block min-w-full" {...props}>
                              {children}
                            </code>
                          </div>
                        )
                      },
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-lime-500 pl-4 py-1 my-2 bg-lime-50/50 dark:bg-lime-900/10 rounded-r italic" {...props} />,
                      table: ({node, ...props}) => <div className="overflow-x-auto my-3"><table className="min-w-full border-collapse border border-stone-200 dark:border-stone-700" {...props} /></div>,
                      th: ({node, ...props}) => <th className="border border-stone-200 dark:border-stone-700 px-3 py-2 bg-stone-50 dark:bg-stone-800 text-left font-semibold" {...props} />,
                      td: ({node, ...props}) => <td className="border border-stone-200 dark:border-stone-700 px-3 py-2" {...props} />,
                    }}
                  >
                    {chat.content}
                  </ReactMarkdown>
                </div>
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
            <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border border-lime-200 dark:border-lime-900 shadow-sm">
              <BsStars size={20} className="text-lime-800 dark:text-lime-400" />
            </div>
            <div className="rounded-2xl p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm">
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
        className="sticky bottom-[84px] w-full px-4 py-3 bg-gradient-to-b from-white/80 to-white dark:from-stone-900/80 dark:to-stone-900 backdrop-blur-sm border-t border-stone-100 dark:border-stone-800 z-20"
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
            <div className="flex-1 flex items-center gap-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-lime-600 focus-within:border-lime-600 focus-within:ring-1 focus-within:ring-lime-600 transition-all shadow-sm">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 p-3.5 text-base text-gray-900 dark:text-white bg-transparent focus:outline-none disabled:text-gray-400"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAttach}
                accept="image/*,application/pdf"
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
