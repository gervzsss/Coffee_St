import { useState } from "react";
import { STATUS_CONFIG, STATUS_FLOW } from "../../constants/orderStatus";

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
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 ${
          nextStatuses.length > 0 ? "bg-[#30442B] text-white hover:bg-[#3d5a35]" : "cursor-not-allowed bg-gray-200 text-gray-500"
        } font-medium transition-colors`}
      >
        <span>{currentConfig.label}</span>
        {nextStatuses.length > 0 && (
          <svg className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
          <div className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {nextStatuses.map((status) => {
              const config = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(status);
                  }}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <span className={`font-medium ${config.textColor}`}>{config.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
