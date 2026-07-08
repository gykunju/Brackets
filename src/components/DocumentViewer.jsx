import { FiX, FiMessageSquare, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { TbSend2 } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { sendMessage } from "../services/aiService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function DocumentViewer({ document, onClose }) {
  const { brackets, units, events, supabase } = useUser();
  const [showChat, setShowChat] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState([
    {
      speaker: "ai",
      content: `I'm analyzing **${document.title}**. What would you like to know about this document?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    setInputMessage("");
    setChats(prev => [...prev, { speaker: "user", content: text }]);
    setIsLoading(true);

    try {
      // Create a targeted context with ONLY this document
      const targetedContext = {
        brackets,
        units,
        events,
        content: [document] // Restrict content to just this document
      };

      const response = await sendMessage(
        `[Focus exclusively on the document "${document.title}"]\n\n${text}`, 
        chats, 
        targetedContext, 
        supabase
      );
      
      setChats(prev => [...prev, { speaker: "ai", content: response }]);
    } catch (error) {
      setChats(prev => [...prev, { speaker: "ai", content: "Error: Could not get a response.", error: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isImage = document.file_type === 'image' || document.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex geist-font">
      {/* Header / Close Button */}
      <div className="absolute top-4 left-4 z-[80] flex gap-2">
        <button 
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-colors"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Main Document Area */}
      <div className={`flex-1 h-full relative transition-all duration-300 ${showChat ? 'md:pr-[400px]' : ''}`}>
        <div className="w-full h-full p-4 pt-16 pb-4">
          <div className="w-full h-full bg-stone-100 dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center">
            {isImage ? (
              <img 
                src={document.file_url} 
                alt={document.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <iframe 
                src={document.file_url}
                className="w-full h-full border-none"
                title={document.title}
              />
            )}
          </div>
        </div>
      </div>

      {/* Chat Toggle Button (when hidden) */}
      <AnimatePresence>
        {!showChat && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setShowChat(true)}
            className="absolute top-4 right-4 z-[80] p-2.5 bg-lime-600 hover:bg-lime-500 text-white shadow-lg rounded-xl flex items-center gap-2"
          >
            <FiMessageSquare size={20} />
            <span className="font-semibold text-sm pr-1">Ask AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-stone-900 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 z-[80] flex flex-col border-l border-stone-200 dark:border-stone-800 ${
          showChat ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2">
            <BsStars className="text-lime-600 dark:text-lime-400" size={20} />
            <h2 className="font-bold text-gray-900 dark:text-white">Ask Document</h2>
          </div>
          <button 
            onClick={() => setShowChat(false)}
            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg text-gray-500 transition-colors"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {chats.map((chat, i) => (
            <div key={i} className={`flex gap-3 max-w-[90%] ${chat.speaker === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className="flex-shrink-0 mt-1">
                {chat.speaker === 'ai' ? (
                   <div className="p-1.5 rounded-full bg-lime-100 dark:bg-stone-800 text-lime-700 dark:text-lime-400"><BsStars size={14}/></div>
                ) : (
                   <div className="w-6 h-6 rounded-full bg-lime-700 text-white flex items-center justify-center text-xs font-bold">U</div>
                )}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                chat.speaker === 'user' 
                  ? 'bg-lime-700 text-white' 
                  : chat.error 
                    ? 'bg-red-50 text-red-800 border border-red-200' 
                    : 'bg-stone-100 dark:bg-stone-800 text-gray-900 dark:text-gray-100 border border-stone-200 dark:border-stone-700'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose dark:prose-invert prose-sm max-w-none">
                  {chat.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[90%] self-start">
              <div className="flex-shrink-0 mt-1">
                 <div className="p-1.5 rounded-full bg-lime-100 dark:bg-stone-800 text-lime-700 dark:text-lime-400"><BsStars size={14}/></div>
              </div>
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-lime-600 animate-bounce" style={{animationDelay: '0ms'}}/>
                 <div className="w-1.5 h-1.5 rounded-full bg-lime-600 animate-bounce" style={{animationDelay: '150ms'}}/>
                 <div className="w-1.5 h-1.5 rounded-full bg-lime-600 animate-bounce" style={{animationDelay: '300ms'}}/>
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-1" />
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about this document..."
              disabled={isLoading}
              className="flex-1 p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:border-lime-500 text-sm dark:text-white"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-lime-700 hover:bg-lime-600 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              <TbSend2 size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;
