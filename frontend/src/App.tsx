import React, { useState } from "react";
import { Database, Bot as BotIcon, Sparkles, Loader2 } from "lucide-react";
import { ChatHistory } from "./components/ChatHistory";
import { ChatInput } from "./components/ChatInput";
import { UserProfile } from "./components/UserProfile";
import { LoginPage } from "./components/LoginPage";
import { Message, User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null); // Stores the logged-in user
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I can help you find information about products and suppliers. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false); // Indicates processing state
  const [error, setError] = useState<string | null>(null); // Stores global errors (optional)

  // Handles user login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error: any) {
      // Ensure the error is a string before propagating it
      throw new Error(error.message || "An unknown error occurred");
    }
  };

  // Handles sending messages to the chat API
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]); // Add user's message to the chat
    setIsLoading(true); // Show loader during API call

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Assuming user contains a token
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error processing the message");
      }

      const data = await response.json(); // Response from the API
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response, // Assuming the API returns a 'response' field
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]); // Add bot's message to the chat
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />; // Render login page if user is not logged in
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <BotIcon size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    AI Product Assistant
                  </h1>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Sparkles size={16} />
                    <p className="text-sm">Powered by LangGraph</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <UserProfile user={user} />

          {/* Chat Container */}
          <div className="h-[600px] flex flex-col bg-gray-50">
            <ChatHistory messages={messages} />
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-x-0 bottom-full mb-2 flex justify-center">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Processing...</span>
                  </div>
                </div>
              )}
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
