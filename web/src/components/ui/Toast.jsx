import React, { useEffect } from "react";

export default function Toast({ id, title, description, onClose, duration = 2500 }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, onClose, duration]);

  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-xl bg-white shadow-soft ring-1 ring-gray-100 p-4">
      <div className="flex">
        <div className="flex-shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{title}</p>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => onClose(id)} aria-label="Закрыть уведомление">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
