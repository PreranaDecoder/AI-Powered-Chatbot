import React from "react";
import { X, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsPanelProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  darkMode,
  onToggleDarkMode,
  onClose,
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
            Settings
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
        <div
          className={`flex items-center justify-between p-3 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon size={20} className="text-gray-300" />
            ) : (
              <Sun size={20} />
            )}
            <span className={darkMode ? "text-white" : "text-gray-800"}>
              Dark Mode
            </span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              darkMode ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
