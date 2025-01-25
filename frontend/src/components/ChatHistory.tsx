import React from "react";
import { Message } from "../types";
import { ChatMessage } from "./ChatMessage";
import { motion, AnimatePresence } from "framer-motion";

interface ChatHistoryProps {
  messages: Message[];
  darkMode: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  darkMode,
}) => {
  console.log("Messages passed to ChatHistory:", messages);
  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        darkMode ? "scrollbar-dark" : "scrollbar-light"
      }`}
    >
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatMessage message={message} darkMode={darkMode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
