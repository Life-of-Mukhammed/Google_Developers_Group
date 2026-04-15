export const TOKEN_KEY = "campus_leaders_token";
export const USER_KEY = "campus_leaders_user";

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { id: string; email: string; phoneNumber?: string; role: string; teamId?: string | null };
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("auth-changed"));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent("auth-changed"));
}

export async function apiFetch(input: string, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.get("Content-Type") && init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers });
}

type ApiResult<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

export async function parseApiJson<T = unknown>(response: Response): Promise<ApiResult<T>> {
  const text = await response.text();

  if (!text.trim()) {
    return {
      success: false,
      message: response.ok ? "Empty response received." : `Request failed with status ${response.status}.`,
    };
  }

  try {
    return JSON.parse(text) as ApiResult<T>;
  } catch {
    return {
      success: false,
      message: response.ok ? "Invalid server response." : `Request failed with status ${response.status}.`,
    };
  }
}
