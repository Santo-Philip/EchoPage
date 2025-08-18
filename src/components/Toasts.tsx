import { useState, useEffect } from "react";

declare global {
  interface Window {
    showToast: (message: string, duration?: number) => void;
  }
}

type Toast = { id: number; message: string };

export default function Toasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.showToast) {
      window.showToast = (message, duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message }]);

        setTimeout(() => {
          // trigger fade out by adding a class
          const toastEl = document.getElementById(`toast-${id}`);
          if (toastEl) toastEl.classList.add("toast-hide");
          // remove after animation
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }, 500); // match animation duration
        }, duration);
      };
    }
  }, []);

  return (
    <>
      <div className="toast-container">
        {toasts.map((t) => (
          <div id={`toast-${t.id}`} key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>

      <style>
        {`
          .toast-container {
            position: fixed;
            bottom: 16px;
            right: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 9999;
          }

          .toast {
            background-color: #0077ff;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(20px);
            animation: toast-show 0.5s forwards;
          }

          .toast-hide {
            animation: toast-hide 0.5s forwards;
          }

          @keyframes toast-show {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes toast-hide {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </>
  );
}
