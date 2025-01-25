import React from "react";
import { X } from "lucide-react";
import { Notification } from "../types";
import { motion } from "framer-motion";

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  darkMode: boolean;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onClose,
  darkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`absolute right-0 top-0 w-80 h-full z-50 shadow-xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`p-4 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Notifications
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              darkMode ? "hover:bg-gray-700 text-gray-400" : "text-gray-500"
            }`}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="p-4">
        {notifications.length === 0 ? (
          <p
            className={`text-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No new notifications
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg mb-2 ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"
              }`}
            >
              <p className="font-medium">{notification.title}</p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {notification.message}
              </p>
              <span
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date(notification.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
