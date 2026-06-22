import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8089/api/v1';

export const TOKEN_KEY = 'ccc_admin_access_token';
export const REFRESH_KEY = 'ccc_admin_refresh_token';

// Some browser contexts (VS Code embedded preview, sandboxed iframes,
// strict privacy modes) deny access to localStorage and *throw* on read.
// We feature-detect once; if denied, fall back to in-memory storage so the
// app at least works for the current tab session.
const memoryStore: Record<string, string> = {};

let _useLocalStorage: boolean | null = null;
const canUseLocalStorage = (): boolean => {
  if (_useLocalStorage !== null) return _useLocalStorage;
  if (typeof window === 'undefined') return (_useLocalStorage = false);
  try {
    const probe = '__ccc_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    _useLocalStorage = true;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      '[ccc] localStorage is blocked; falling back to in-memory token storage (tokens cleared on tab close).',
    );
    _useLocalStorage = false;
  }
  return _useLocalStorage;
};

const safeGet = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  if (canUseLocalStorage()) {
    try { return window.localStorage.getItem(key); } catch { /* fall through */ }
  }
  return memoryStore[key] ?? null;
};

const safeSet = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  if (canUseLocalStorage()) {
    try { window.localStorage.setItem(key, value); return; } catch { /* fall through */ }
  }
  memoryStore[key] = value;
};

const safeRemove = (key: string) => {
  if (typeof window === 'undefined') return;
  if (canUseLocalStorage()) {
    try { window.localStorage.removeItem(key); return; } catch { /* fall through */ }
  }
  delete memoryStore[key];
};

export const getAccessToken = () => safeGet(TOKEN_KEY);
export const getRefreshToken = () => safeGet(REFRESH_KEY);

export const setTokens = (access: string, refresh: string) => {
  safeSet(TOKEN_KEY, access);
  safeSet(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  safeRemove(TOKEN_KEY);
  safeRemove(REFRESH_KEY);
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    // Backend middleware reads raw token from Authorization header (no "Bearer " prefix)
    config.headers.Authorization = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearTokens();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
