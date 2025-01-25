import React from "react";
import { MessageCircle, Bot } from "lucide-react";
import { Message } from "../types";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: Message;
  darkMode: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  darkMode,
}) => {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      className={`flex gap-3 ${isBot ? "flex-row" : "flex-row-reverse"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isBot
            ? darkMode
              ? "bg-blue-900"
              : "bg-blue-100"
            : darkMode
            ? "bg-green-900"
            : "bg-green-100"
        }`}
      >
        {isBot ? (
          <Bot
            size={20}
            className={darkMode ? "text-blue-300" : "text-blue-600"}
          />
        ) : (
          <MessageCircle
            size={20}
            className={darkMode ? "text-green-300" : "text-green-600"}
          />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isBot
            ? darkMode
              ? "bg-gray-800 text-white"
              : "bg-blue-50 text-gray-800"
            : darkMode
            ? "bg-gray-700 text-white"
            : "bg-green-50 text-gray-800"
        }`}
      >
        <p className={darkMode ? "text-gray-100" : "text-gray-800"}>
          {message.content}
        </p>
        <span
          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};
