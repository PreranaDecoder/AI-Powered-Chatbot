import React, { useState, useEffect } from "react";
import {
  Database,
  Bot as BotIcon,
  Sparkles,
  Loader2,
  Sun,
  Moon,
  Plus,
} from "lucide-react";
import { ChatHistory } from "./components/ChatHistory";
import { ChatInput } from "./components/ChatInput";
import { UserProfile } from "./components/UserProfile";
import { LoginPage } from "./components/LoginPage";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { Message, User, Notification } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary

function App() {
  const [user, setUser] = useState<User | null>(null); // Logged-in user
  const [messages, setMessages] = useState<Message[]>([]); // Current chat messages
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // Notifications
  const [currentChatId, setCurrentChatId] = useState<string>("default");
  const [chats, setChats] = useState<Map<string, Message[]>>(
    new Map([["default", []]])
  ); // Map of chat sessions

  // Fetch chat history on user or chat ID change
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user, currentChatId]);

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/history/${user?.id}/${currentChatId}`
      );
      const history = await response.json();

      // Ensure history is an array
      setMessages(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setMessages([]); // Default to an empty array on error
    }
  };

  // Handle user login
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
      setUser(userData); // Assuming API returns a user object
    } catch (error) {
      throw error;
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]); // Add user message to UI
    setIsLoading(true); // Show loader during processing

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Assuming user contains a token
        },
        body: JSON.stringify({
          content,
          sender: "user",
          user_id: user.id,
          chat_id: currentChatId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error processing the message");
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]); // Add bot response to UI
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

  // Start a new chat session
  const startNewChat = () => {
    const newChatId = Date.now().toString();
    setChats((prev) => new Map(prev.set(newChatId, [])));
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-5xl mx-auto rounded-2xl shadow-xl overflow-hidden border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${
              darkMode
                ? "from-blue-900 to-purple-900"
                : "from-blue-600 to-purple-600"
            } p-6`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 p-3 rounded-xl"
                >
                  <BotIcon size={28} className="text-white" />
                </motion.div>
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
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewChat}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <Plus size={20} />
                  <span>New Chat</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <UserProfile
            user={user}
            darkMode={darkMode}
            onNotificationsClick={() =>
              setShowNotifications(!showNotifications)
            }
            onSettingsClick={() => setShowSettings(!showSettings)}
          />

          {/* Chat Container */}
          <ErrorBoundary>
            <div
              className={`h-[600px] flex flex-col ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <AnimatePresence mode="wait">
                {showNotifications && (
                  <NotificationsPanel
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    darkMode={darkMode}
                  />
                )}
                {showSettings && (
                  <SettingsPanel
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                    onClose={() => setShowSettings(false)}
                  />
                )}
              </AnimatePresence>

              <ChatHistory messages={messages} darkMode={darkMode} />

              <div className="relative">
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-0 bottom-full mb-2 flex justify-center"
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
                        darkMode
                          ? "bg-gray-800 text-gray-200"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      <Loader2
                        size={16}
                        className="animate-spin text-blue-600"
                      />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </motion.div>
                )}
                <ChatInput
                  onSendMessage={handleSendMessage}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </ErrorBoundary>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
