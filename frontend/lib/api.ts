export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || "";
}

async function request(path: string, options: ApiOptions = {}) {
  const headers: Record<string, string> = { ...(options.headers || {}) };
  const authToken = token();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error: any = new Error(data?.detail || "Request failed");
    error.response = { data };
    throw error;
  }
  return { data };
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) => request(path, { method: "POST", body }),
  put: (path: string, body?: unknown) => request(path, { method: "PUT", body }),
};

export function saveSession(accessToken: string) {
  localStorage.setItem("accessToken", accessToken);
}

export function getToken() {
  return token();
}
