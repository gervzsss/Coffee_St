import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickSettingsPanel({ onChangePassword, onDeleteAccount, onLogout, onLanguageChange, currentLanguage = "en" }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl">
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
        <h3 className="font-outfit flex items-center justify-between text-base font-semibold text-gray-900 sm:text-lg">QUICK SETTINGS</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {/* SECURITY Section */}
        <div>
          <button onClick={() => toggleSection("security")} className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 sm:px-5 sm:py-4 lg:px-6">
            <span className="text-sm font-medium text-gray-700 sm:text-base">SECURITY</span>
            {expandedSection === "security" ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>

          <AnimatePresence>
            {expandedSection === "security" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50"
              >
                <button
                  onClick={onChangePassword}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#30442B] sm:px-5 sm:py-3 sm:text-base lg:px-6"
                >
                  CHANGE PASSWORD
                </button>
                <button
                  onClick={onDeleteAccount}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 sm:px-5 sm:py-3 sm:text-base lg:px-6"
                >
                  DELETE ACCOUNT
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LANGUAGE Section */}
        <div>
          <button onClick={() => toggleSection("language")} className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 sm:px-5 sm:py-4 lg:px-6">
            <span className="text-sm font-medium text-gray-700 sm:text-base">LANGUAGE</span>
            {expandedSection === "language" ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </button>

          <AnimatePresence>
            {expandedSection === "language" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50"
              >
                <div className="px-6 py-3">
                  <label className="mb-2 block text-xs font-medium text-gray-500">CHANGE LANGUAGE</label>
                  <select
                    value={currentLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-[#30442B] focus:ring-2 focus:ring-[#30442B]/20 focus:outline-none"
                  >
                    <option value="en">English</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LOG OUT */}
        <button onClick={onLogout} className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 sm:px-5 sm:py-4 lg:px-6">
          <span className="text-sm font-medium text-gray-700 sm:text-base">LOG OUT</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
