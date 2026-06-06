import axios from "axios";
import type { TaskStatus as UiTaskStatus } from "@/lib/data";

/**
 * Axios instance for the TaskFlow backend. The base URL comes from
 * NEXT_PUBLIC_API_URL (set in .env.local) and defaults to the local backend.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
});

/* ----------------------------------------------------------------------------
 * Token storage (JWT in localStorage)
 * -------------------------------------------------------------------------- */

const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

// Subscribers (the AuthProvider) are notified whenever auth storage changes, so
// useSyncExternalStore can track it without setState-in-effect.
const authListeners = new Set<() => void>();

export function subscribeAuth(listener: () => void): () => void {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function notifyAuth() {
  authListeners.forEach((listener) => listener());
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  notifyAuth();
}

// Cache the parsed user so the snapshot is referentially stable between reads
// (required by useSyncExternalStore) and only changes when the raw value does.
let cachedUserRaw: string | null = null;
let cachedUser: ApiUser | null = null;

export function getStoredUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (raw !== cachedUserRaw) {
    cachedUserRaw = raw;
    cachedUser = raw ? (JSON.parse(raw) as ApiUser) : null;
  }
  return cachedUser;
}

export function setStoredUser(user: ApiUser) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuth();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  notifyAuth();
}

// Attach the JWT to every request when we have one.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is missing/expired, drop it and bounce to login — unless we're
// already on an auth screen (so a bad login shows its error instead of looping).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const onAuthPage = ["/login", "/signup"].some((p) =>
        window.location.pathname.startsWith(p),
      );
      if (!onAuthPage) {
        clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

/** Pulls a human-readable message out of an Axios error. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === "string") return message;
  }
  return fallback;
}

/* ----------------------------------------------------------------------------
 * Backend types
 * -------------------------------------------------------------------------- */

export interface ApiUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiProject {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  doneCount: number;
}

export type ApiTaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  status: ApiTaskStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string };
}

/* ----------------------------------------------------------------------------
 * Status mapping — UI uses "todo" / "in-progress" / "done"; the API uses the
 * uppercase enum.
 * -------------------------------------------------------------------------- */

const UI_TO_API: Record<UiTaskStatus, ApiTaskStatus> = {
  todo: "TODO",
  "in-progress": "IN_PROGRESS",
  done: "DONE",
};

const API_TO_UI: Record<ApiTaskStatus, UiTaskStatus> = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

export const toApiStatus = (s: UiTaskStatus): ApiTaskStatus => UI_TO_API[s];
export const toUiStatus = (s: ApiTaskStatus): UiTaskStatus => API_TO_UI[s];

/* ----------------------------------------------------------------------------
 * Typed API calls
 * -------------------------------------------------------------------------- */

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api
      .post<AuthResponse>("/auth/register", { name, email, password })
      .then((r) => r.data),
  me: () => api.get<ApiUser>("/auth/me").then((r) => r.data),
};

export const projectsApi = {
  list: () => api.get<ApiProject[]>("/projects").then((r) => r.data),
  create: (name: string, description?: string) =>
    api
      .post<ApiProject>("/projects", { name, description })
      .then((r) => r.data),
};

export const tasksApi = {
  list: () => api.get<ApiTask[]>("/tasks").then((r) => r.data),
  create: (input: {
    projectId: string;
    title: string;
    description?: string;
    status?: ApiTaskStatus;
  }) => api.post<ApiTask>("/tasks", input).then((r) => r.data),
  update: (
    id: string,
    input: { title?: string; description?: string; status?: ApiTaskStatus },
  ) => api.patch<ApiTask>(`/tasks/${id}`, input).then((r) => r.data),
  updateStatus: (id: string, status: ApiTaskStatus) =>
    api
      .patch<ApiTask>(`/tasks/${id}/status`, { status })
      .then((r) => r.data),
};
