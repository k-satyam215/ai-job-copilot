"use client";

import { useEffect, useRef, useCallback } from "react";
import { API_BASE, getToken } from "./api";

export type SSEEvent = {
  type: string;
  [key: string]: any;
};

export function useSSE(onEvent: (event: SSEEvent) => void) {
  const esRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    const token = getToken();
    if (!token || esRef.current) return;

    const url = `${API_BASE}/ops/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type !== "connected") {
          onEventRef.current(data);
        }
      } catch {}
    };

    es.onerror = () => {
      es.close();
      esRef.current = null;
      // Reconnect after 5s
      setTimeout(connect, 5000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [connect]);
}
