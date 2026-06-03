export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

const TOKEN_KEY = "token";

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY) || "";
}

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
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
    if (response.status === 401) {
      try {
        if (!path.startsWith("/auth/")) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("auth:expired", {
                detail: { redirect: "/login?session=expired" },
              })
            );
            setTimeout(() => {
              clearSession();
            }, 800);
          }
        }
      } catch {
        /* noop */
      }
    }
    const error: any = new Error(data?.detail || "Request failed");
    error.response = { data };
    error.status = response.status;
    throw error;
  }
  return { data };
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) => request(path, { method: "POST", body }),
  put: (path: string, body?: unknown) => request(path, { method: "PUT", body }),
  patch: (path: string, body?: unknown) => request(path, { method: "PATCH", body }),
  delete: (path: string) => request(path, { method: "DELETE" }),
};

export function saveSession(accessToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${TOKEN_KEY}=${accessToken}; expires=${expires}; path=/; SameSite=Lax`;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  window.location.href = "/login";
}

export function getToken() {
  return token();
}
