import { useState } from 'react';
import { STATUS_CONFIG, STATUS_FLOW } from '../../constants/orderStatus';

export default function StatusDropdown({ order, onStatusChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const nextStatuses = STATUS_FLOW[order.status] || [];

  const handleSelect = (status) => {
    setIsOpen(false);
    onStatusChange(order.id, order.status, status);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (nextStatuses.length > 0) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled || nextStatuses.length === 0}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg ${
          nextStatuses.length > 0
            ? 'bg-[#30442B] text-white hover:bg-[#3d5a35]'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        } transition-colors font-medium`}
      >
        <span>{currentConfig.label}</span>
        {nextStatuses.length > 0 && (
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            {nextStatuses.map((status) => {
              const config = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(status);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className={`font-medium ${config.textColor}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
