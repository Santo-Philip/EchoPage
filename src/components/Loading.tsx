import { useState, useEffect } from "react";

declare global {
  interface Window {
    showLoading: (show: boolean, fullScreen?: boolean) => void;
  }
}

type LoadingState = {
  show: boolean;
  fullScreen: boolean;
};

export default function Loading() {
  const [loading, setLoading] = useState<LoadingState>({ show: false, fullScreen: false });

  useEffect(() => {
    if (typeof window !== "undefined" && !window.showLoading) {
      window.showLoading = (show: boolean, fullScreen = false) => {
        setLoading({ show, fullScreen });
        if (fullScreen) {
          document.body.style.overflow = show ? "hidden" : "";
        }
      };
    }
  }, []);

  if (!loading.show) return null;

  return (
    <>
      <div
        className={`loading-container ${loading.fullScreen ? "fullscreen" : "corner"}`}
      >
        <div className="spinner" />
      </div>

      <style>
        {`
          .loading-container {
            position: fixed;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.3s;
          }

          .loading-container.fullscreen {
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
          }

          .loading-container.corner {
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: rgba(0,0,0,0.8);
            border-radius: 8px;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
