import { useState, useRef, useEffect } from "react";
import { Send, Check, AlertTriangle } from "lucide-react"; 

export default function StatusDropdown({ invoice, handleStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex justify-center items-center border px-3 py-2 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
      >
        Change Status
        <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 
             1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {invoice.status !== 'sent' && (
            <button
              onClick={() => {
                handleStatusChange('sent');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Mark as Sent
            </button>
          )}
          {invoice.status !== 'paid' && (
            <button
              onClick={() => {
                handleStatusChange('paid');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark as Paid
            </button>
          )}
          {invoice.status !== 'overdue' && (
            <button
              onClick={() => {
                handleStatusChange('overdue');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Mark as Overdue
            </button>
          )}
          {invoice.status !== 'canceled' && (
            <button
              onClick={() => {
                handleStatusChange('canceled');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 
                    111.414 1.414L11.414 10l4.293 4.293a1 1 0 
                    01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 
                    01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel Invoice
            </button>
          )}
        </div>
      )}
    </div>
  );
}