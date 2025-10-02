import { useState, useRef, useEffect } from "react";
import { BsStars } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { TbSend2 } from "react-icons/tb";
import { IoMdAttach } from "react-icons/io";
import { generateText } from "../config/gemini";
import { useAuth } from "../contexts/AuthContext";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

// Updated: Using direct Gemini SDK integration
function Ai_Assistant() {
  const { user, profile } = useAuth();
  const [chats, setChats] = useState([
    {
      speaker: "ai",
      content: "Hello! I'm your AI tutor powered by Gemini. I can help you with personalized learning recommendations, instant quiz feedback, study tips tailored to your progress, and answers to any academic questions. What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setError("");

    // Add user message to chat
    const newUserChat = {
      speaker: "user",
      content: userMessage,
      timestamp: new Date()
    };
    setChats(prev => [...prev, newUserChat]);

    setLoading(true);

    try {
      // Build context-aware prompt
      const contextPrompt = `You are an AI tutor for the Brackets learning platform, which focuses on the Kenyan curriculum and community-powered learning.

Current user: ${profile?.full_name || 'Student'}
User role: ${profile?.role || 'learner'}

Previous conversation context:
${chats.slice(-4).map(c => `${c.speaker === 'ai' ? 'AI' : 'User'}: ${c.content}`).join('\n')}

Student's question: ${userMessage}

Please provide a helpful, educational response. Be friendly, encouraging, and specific.`;

      console.log('Generating response with Gemini...');

      // Use the generateText function from gemini.js
      const aiReply = await generateText(contextPrompt);

      console.log('✅ Response received from Gemini');

      // Add AI response to chat
      const newAiChat = {
        speaker: "ai",
        content: aiReply,
        timestamp: new Date()
      };
      setChats(prev => [...prev, newAiChat]);

    } catch (err) {
      console.error('❌ AI error:', err);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (err.message?.includes('API key')) {
        errorMessage = '⚠️ Gemini API key not configured. Please add your API key to the .env file.';
      } else if (err.message?.includes('quota')) {
        errorMessage = '⚠️ API quota exceeded. Please try again later.';
      } else if (err.message?.includes('safety')) {
        errorMessage = '⚠️ Response blocked by safety filters. Please rephrase your question.';
      } else {
        errorMessage = `⚠️ ${err.message}`;
      }

      setError(errorMessage);
      
      // Add error message to chat
      const errorChat = {
        speaker: "ai",
        content: errorMessage,
        timestamp: new Date()
      };
      setChats(prev => [...prev, errorChat]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col geist-font min-h-screen relative pb-32">
      {/* Header */}
      <div className="flex flex-col text-center pt-5 pb-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 sticky top-0 z-10">
        <h1 className="geist-font wght-700 text-xl">AI Tutor</h1>
        <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
          <span className={`inline-block w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
          Powered by Gemini AI
        </span>
      </div>

      {/* Chats Container */}
      <div className="flex flex-col gap-5 p-5 lg:px-70 flex-1 overflow-y-auto">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 max-w-[95%] lg:max-w-[65%] ${
              chat.speaker === "user"
                ? "self-end flex-row-reverse"
                : "self-start flex-row"
            }`}
          >
            {/* Avatar */}
            <div>
              {chat.speaker === "ai" ? (
                <BsStars
                  size={28}
                  className="p-1 border rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-600 dark:text-purple-300"
                />
              ) : (
                <LiaUser 
                  size={28} 
                  className="p-1 border rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400" 
                />
              )}
            </div>

            {/* Message */}
            <div className="flex-1">
              <span
                className={`block text-xs font-semibold mb-1 ${
                  chat.speaker === "user" ? "text-right" : "text-left"
                }`}
              >
                {chat.speaker === "ai" ? "AI Tutor" : "You"}
              </span>
              <div
                className={`rounded-2xl p-4 ${
                  chat.speaker === "user"
                    ? "bg-lime-700 text-white"
                    : "bg-stone-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                {chat.speaker === "ai" ? (
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // Custom styling for inline code
                        code: ({node, inline, className, children, ...props}) => (
                          inline ? 
                            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code> :
                            <code className="block bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm my-2 overflow-x-auto" {...props}>
                              {children}
                            </code>
                        ),
                        // Custom styling for paragraphs
                        p: ({node, children, ...props}) => (
                          <p className="my-2" {...props}>{children}</p>
                        ),
                        // Headings
                        h1: ({node, children, ...props}) => (
                          <h1 className="text-xl font-bold my-3" {...props}>{children}</h1>
                        ),
                        h2: ({node, children, ...props}) => (
                          <h2 className="text-lg font-bold my-3" {...props}>{children}</h2>
                        ),
                        h3: ({node, children, ...props}) => (
                          <h3 className="text-base font-bold my-2" {...props}>{children}</h3>
                        ),
                        // Custom styling for links
                        a: ({node, children, ...props}) => (
                          <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props}>{children}</a>
                        ),
                        // Better list styling
                        ul: ({node, children, ...props}) => (
                          <ul className="list-disc pl-6 my-2 space-y-1" {...props}>{children}</ul>
                        ),
                        ol: ({node, children, ...props}) => (
                          <ol className="list-decimal pl-6 my-2 space-y-1" {...props}>{children}</ol>
                        ),
                        // Strong/bold
                        strong: ({node, children, ...props}) => (
                          <strong className="font-bold" {...props}>{children}</strong>
                        ),
                        // Emphasis/italic
                        em: ({node, children, ...props}) => (
                          <em className="italic" {...props}>{children}</em>
                        ),
                      }}
                    >
                      {chat.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{chat.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex items-end gap-2 max-w-[95%] lg:max-w-[65%] self-start">
            <div>
              <BsStars
                size={28}
                className="p-1 border rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-600 dark:text-purple-300"
              />
            </div>
            <div className="flex-1">
              <span className="block text-xs font-semibold mb-1">AI Tutor</span>
              <div className="rounded-2xl p-4 bg-stone-100 dark:bg-gray-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 lg:px-62 fixed bottom-20 right-0 left-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <div className="flex items-center flex-1 border-2 border-lime-600 dark:border-lime-500 rounded-full px-4">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={loading}
              className="p-3 flex-1 focus:outline-none focus:ring-0 bg-transparent disabled:opacity-50"
            />
            <button 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-30"
              disabled={loading}
              title="Attach file (coming soon)"
            >
              <IoMdAttach size={24} />
            </button>
          </div>
          <button 
            onClick={sendMessage}
            disabled={loading || !inputMessage.trim()}
            className="rounded-full p-3 bg-lime-600 hover:bg-lime-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <TbSend2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ai_Assistant