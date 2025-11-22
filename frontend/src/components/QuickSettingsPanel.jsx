import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickSettingsPanel({ 
  onChangePassword, 
  onDeleteAccount, 
  onLogout,
  onLanguageChange,
  currentLanguage = 'en'
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          QUICK SETTINGS
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {/* SECURITY Section */}
        <div>
          <button
            onClick={() => toggleSection('security')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <span className="font-medium text-gray-700">SECURITY</span>
            {expandedSection === 'security' ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'security' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50"
              >
                <button
                  onClick={onChangePassword}
                  className="w-full px-6 py-3 text-left text-gray-600 hover:text-[#30442B] hover:bg-gray-100 transition-colors"
                >
                  CHANGE PASSWORD
                </button>
                <button
                  onClick={onDeleteAccount}
                  className="w-full px-6 py-3 text-left text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                >
                  DELETE ACCOUNT
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LANGUAGE Section */}
        <div>
          <button
            onClick={() => toggleSection('language')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <span className="font-medium text-gray-700">LANGUAGE</span>
            {expandedSection === 'language' ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'language' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50"
              >
                <div className="px-6 py-3">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    CHANGE LANGUAGE
                  </label>
                  <select
                    value={currentLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30442B]/20 focus:border-[#30442B] bg-white text-gray-700"
                  >
                    <option value="en">English</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LOG OUT */}
        <button
          onClick={onLogout}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <span className="font-medium text-gray-700">LOG OUT</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
