import { BsStars } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { TbSend2 } from "react-icons/tb";
import { IoMdAttach, IoMdClose } from "react-icons/io";
import { FiMessageSquare, FiMenu, FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { sendMessage, analyzeImage, analyzeVisualPDF } from "../services/aiService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Ai_Assistant() {
  const { brackets, units, content, events, supabase, profile } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Chat History State
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Ref for the chat container
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (profile?.id) {
      fetchSessions();
    }
  }, [profile?.id]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_session')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSessions(data || []);

      if (data && data.length > 0 && !activeSession) {
        setActiveSession(data[0]);
        fetchMessages(data[0].id);
      } else if (!activeSession) {
        startNewSession();
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      // Fallback if table doesn't exist yet
      if (!activeSession) startNewSession();
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from('chat_message')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setChats(data.map(msg => ({
          speaker: msg.role,
          content: msg.content
        })));
      } else {
        setChats([{ speaker: "ai", content: "Hello! I'm here to assist you with any questions or tasks related to your studies. Feel free to ask me anything!" }]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setChats([{ speaker: "ai", content: "Hello! I'm here to assist you with any questions or tasks related to your studies. Feel free to ask me anything!" }]);
    }
  };

  const startNewSession = () => {
    setActiveSession(null);
    setChats([{ speaker: "ai", content: "Hello! I'm here to assist you with any questions or tasks related to your studies. Feel free to ask me anything!" }]);
    if (window.innerWidth < 768) setShowHistory(false);
  };

  const saveMessageToDb = async (sessionId, role, content) => {
    try {
      await supabase.from('chat_message').insert([{
        session_id: sessionId,
        user_id: profile.id,
        role: role,
        content: content
      }]);
    } catch (err) {
      console.error("Failed to save message", err);
    }
  };

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await supabase.from('chat_session').delete().eq('id', sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSession?.id === sessionId) {
        startNewSession();
      }
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  // Handle sending messages
  const submitMessage = async (text, file = null) => {
    if (!text && !file) return;

    try {
      let currentSessionId = activeSession?.id;

      // Create session if it doesn't exist
      if (!currentSessionId && profile?.id) {
        try {
          const { data, error } = await supabase.from('chat_session').insert([{
            user_id: profile.id,
            title: text.substring(0, 30) + (text.length > 30 ? '...' : '')
          }]).select().single();
          
          if (error) throw error;
          
          if (data) {
            currentSessionId = data.id;
            setActiveSession(data);
            setSessions(prev => [data, ...prev]);
          }
        } catch (err) {
          console.error("Failed to create session", err);
          toast.error("Failed to create a new chat session.");
        }
      }

      // Add user message to chat UI
      const newUserChat = { speaker: "user", content: text, file: file ? file.name : null };
      setChats((prev) => [...prev, newUserChat]);
      setIsLoading(true);

      // Save user message to DB
      if (currentSessionId) {
        try {
          await saveMessageToDb(currentSessionId, 'user', text);
        } catch (err) {
          console.error("Failed to save message", err);
        }
      }

      let aiResponse;
      const userContext = { brackets, units, content, events };

      if (file) {
        if (file.type.startsWith('image/')) {
          aiResponse = await analyzeImage(file, text || "Describe this image and extract any important information from it.");
        } else if (file.type === 'application/pdf') {
          aiResponse = await analyzeVisualPDF(file, text || "Describe the contents of this PDF document.");
        }
      } else {
        aiResponse = await sendMessage(text, chats, userContext, supabase);
      }

      setChats((prev) => [...prev, { speaker: "ai", content: aiResponse }]);

      // Save AI message to DB
      if (currentSessionId) {
        await saveMessageToDb(currentSessionId, 'ai', aiResponse);
      }
    } catch (error) {
      console.error("Error in submitMessage:", error);
      toast.error(`Error: ${error.message}`);
      setChats((prev) => [...prev, { speaker: "ai", content: "Sorry, I encountered an error processing your request. Please try again.", error: true }]);
    } finally {
      setIsLoading(false);
      if (!file) setAttachedFile(null);
    }
  };

  useEffect(() => {
    const query = searchParams.get("q");
    if (query && !isLoading) {
      setSearchParams({});
      submitMessage(query, null);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = inputMessage.trim();
    if (!userMessage && !attachedFile) return;
    setInputMessage("");
    submitMessage(userMessage, attachedFile);
  };

  const handleFileAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setAttachedFile(file);
      } else {
        alert("Currently, only image and PDF files are supported for direct attachment.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950 geist-font overflow-hidden relative">
      
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHistory(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* History Sidebar */}
      <motion.div
        className={`fixed md:relative z-50 h-full w-72 bg-stone-100 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col transition-transform duration-300 ${
          showHistory ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiMessageSquare className="text-lime-700 dark:text-lime-500" />
            <h2 className="font-bold text-gray-900 dark:text-white">Chat History</h2>
          </div>
          <button onClick={() => setShowHistory(false)} className="md:hidden p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg">
            <FiX />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={startNewSession}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-lime-800 hover:bg-lime-700 text-white rounded-xl shadow-sm transition-colors font-semibold"
          >
            <FiPlus /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => {
                setActiveSession(session);
                fetchMessages(session.id);
                if (window.innerWidth < 768) setShowHistory(false);
              }}
              className={`w-full text-left px-3 py-3 rounded-xl flex items-center justify-between group cursor-pointer transition-colors ${
                activeSession?.id === session.id 
                  ? 'bg-lime-100/50 dark:bg-lime-900/30 text-lime-900 dark:text-lime-300' 
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="truncate pr-2 text-sm font-medium">{session.title}</span>
              <button 
                onClick={(e) => deleteSession(e, session.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-all"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-stone-100 dark:border-stone-800 z-20">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="md:hidden p-2 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <FiMenu className="text-gray-700 dark:text-gray-300" />
          </button>
          <BsStars size={22} className="text-lime-800 dark:text-lime-400" />
          <h1 className="font-bold text-lg text-gray-900 dark:text-white truncate">
            {activeSession ? activeSession.title : "AI Assistant"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
             <span className="text-xs text-gray-600 dark:text-stone-400 hidden sm:inline">
               {isLoading ? "Thinking..." : "Online"}
             </span>
          </div>
        </div>

        {/* Chats */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {chats.map((chat, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                key={index}
                className={`flex items-end gap-3 max-w-[94%] lg:max-w-[85%] ${chat.speaker === "user" ? "self-end flex-row-reverse" : "self-start flex-row"}`}
              >
                <div className="flex-shrink-0">
                  {chat.speaker === "ai" ? (
                    <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border border-lime-200 dark:border-lime-900 shadow-sm">
                      <BsStars size={18} className="text-lime-800 dark:text-lime-400" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-gradient-to-br from-lime-800 to-lime-900 shadow-sm">
                      <LiaUser size={18} className="text-white" />
                    </div>
                  )}
                </div>

                <div className={`flex flex-col ${chat.speaker === "user" ? "items-end" : "items-start"}`}>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mb-1 px-1">
                    {chat.speaker === "ai" ? "AI Assistant" : "You"}
                  </span>
                  <div
                    className={`rounded-2xl p-4 text-sm sm:text-base ${chat.speaker === "user"
                        ? "bg-lime-800 text-white shadow-sm"
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
                          code: ({node, inline, children, ...props}) => {
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
                      <div className="mt-2 text-xs opacity-75 flex items-center gap-1 bg-black/10 dark:bg-white/10 w-fit px-2 py-1 rounded">
                        <IoMdAttach size={12} />
                        {chat.file}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3 self-start">
                <div className="p-2 rounded-full bg-gradient-to-br from-lime-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 border border-lime-200 dark:border-lime-900 shadow-sm">
                  <BsStars size={18} className="text-lime-800 dark:text-lime-400" />
                </div>
                <div className="rounded-2xl p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-800 dark:bg-lime-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-800 dark:bg-lime-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-800 dark:bg-lime-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} className="h-1" />
          </div>
        </div>

        {/* Input Box */}
        <div className="absolute bottom-0 left-0 right-0 w-full px-4 py-4 bg-gradient-to-t from-white via-white to-transparent dark:from-stone-950 dark:via-stone-950 dark:to-transparent z-20">
          <div className="max-w-4xl mx-auto">
            
            <AnimatePresence>
              {attachedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="mb-2 w-fit flex items-center gap-2 p-1.5 pr-2 rounded-lg bg-lime-50 dark:bg-lime-900/30 border border-lime-200 dark:border-lime-800/50"
                >
                  <div className="p-1 bg-lime-200/50 dark:bg-lime-800/50 rounded">
                    <IoMdAttach size={14} className="text-lime-800 dark:text-lime-400" />
                  </div>
                  <span className="text-xs text-lime-900 dark:text-lime-200 max-w-[200px] truncate font-medium">
                    {attachedFile.name}
                  </span>
                  <button onClick={() => setAttachedFile(null)} className="p-1 hover:bg-lime-200 dark:hover:bg-lime-800 rounded transition-colors ml-1">
                    <IoMdClose size={14} className="text-lime-800 dark:text-lime-400" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1 flex items-end gap-2 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-800 focus-within:border-lime-600 dark:focus-within:border-lime-500 transition-all shadow-lg p-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-gray-500 dark:text-stone-400 hover:text-lime-700 hover:bg-lime-50 dark:hover:text-lime-400 dark:hover:bg-lime-900/30 transition-colors disabled:opacity-50"
                >
                  <IoMdAttach size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileAttach}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 py-3 px-2 text-base text-gray-900 dark:text-white bg-transparent focus:outline-none disabled:text-gray-400 placeholder:text-gray-400 dark:placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
                  className="p-3 rounded-xl bg-lime-800 dark:bg-lime-600 text-white hover:bg-lime-700 dark:hover:bg-lime-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-300 dark:disabled:bg-stone-700"
                >
                  <TbSend2 size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Ai_Assistant;
