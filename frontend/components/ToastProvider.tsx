"use client";

import { createContext, useContext, useCallback, useState, useRef, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timerRef.current[id]);
    delete timerRef.current[id];
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      timerRef.current[id] = setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const COLORS: Record<ToastType, string> = {
    success: "var(--green)",
    error: "var(--red)",
    info: "var(--accent)",
    warning: "#f59e0b",
  };

  const ICONS: Record<ToastType, string> = {
    success: "✓",
    error: "⚠",
    info: "ℹ",
    warning: "⚡",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 16px",
              background: "rgba(20,22,30,0.97)",
              border: `1px solid ${COLORS[t.type]}40`,
              borderLeft: `3px solid ${COLORS[t.type]}`,
              borderRadius: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
              pointerEvents: "auto",
              animation: "slideIn 0.25s ease",
            }}
          >
            <span style={{ color: COLORS[t.type], fontWeight: 700, fontSize: 14, lineHeight: 1 }}>
              {ICONS[t.type]}
            </span>
            <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, flex: 1 }}>
              {t.message}
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
