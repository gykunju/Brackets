import { BsStars } from "react-icons/bs";
import { LiaUser } from "react-icons/lia";
import { FiSend } from "react-icons/fi";
import { IoMdAttach } from "react-icons/io";
import { TbSend2 } from "react-icons/tb";
import { useRef, useEffect } from 'react'
import {motion} from 'framer-motion'

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
  ];

  // Ref for the chat container
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when chats change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col geist-font min-h-screen relative pb-50"
    >
      {/* Header */}
      <div className="flex flex-col text-center pt-5 pb-3 bg-stone-100 sticky top-0">
        <h1 className="geist-font wght-700 text-xl">Ai Assistant</h1>
        <span className="text-xs">Offline</span>
      </div>

      {/* chats */}
      <div className="flex flex-col gap-5 p-5 lg:px-70">
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
                  className="p-1 border rounded-full bg-stone-100"
                />
              ) : (
                <LiaUser size={28} className="p-1 border rounded-full" />
              )}
            </div>

            {/* Message */}
            <div>
              <span
                className={`block text-xs font-semibold mb-1 ${
                  chat.speaker == "user" ? "place-self-end" : ""
                }`}
              >
                {chat.speaker === "ai" ? "AI Assistant" : "You"}
              </span>
              <p
                className={`rounded-lg p-4 text-lg ${
                  chat.speaker == "user"
                    ? "bg-lime-900 text-stone-100"
                    : "bg-stone-100"
                }`}
              >
                {chat.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* text box */}
      <div className="p-1 lg:px-62 z-10 bottom-24 right-0 left-2 bg-white fixed">
        <div className="flex items-center p-2 gap-4">
          <div className="flex items-center w-[90%] border-2 border-lime-900 rounded-4xl px-2">
            <input
              type="text"
              className="p-3 w-[96%] focus:outline-none focus:ring-0 text-xl"
            />
            <IoMdAttach size={27} />
          </div>
          <TbSend2
            size={50}
            className="rounded-3xl p-2 bg-lime-800 text-gray-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Ai_Assistant