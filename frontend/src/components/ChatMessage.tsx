import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isBot ? 'bg-blue-100' : 'bg-green-100'
      }`}>
        {isBot ? <Bot size={20} className="text-blue-600" /> : 
                 <MessageCircle size={20} className="text-green-600" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isBot ? 'bg-blue-50' : 'bg-green-50'
      }`}>
        <p className="text-gray-800">{message.content}</p>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}