const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
};

type Session = {
  id: string;
  userId: string;
  expiresAt: string;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string; error?: string }).message ??
        (body as { message?: string; error?: string }).error ??
        "Something went wrong",
    );
  }
  return res.json() as Promise<T>;
}

export const loginApi = (email: string, password: string) =>
  apiFetch<{ user: User; message: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerApi = (email: string, password: string) =>
  apiFetch<{ user: { id: string; email: string }; message: string }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );

export const logoutApi = () =>
  apiFetch<{ message: string }>("/api/auth/logout", { method: "POST" });

export const getMeApi = () =>
  apiFetch<{ user: User; message: string; session: Session }>("/api/auth/me");

export const resetPasswordApi = (email: string) =>
  apiFetch<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const validateResetTokenApi = (token: string) =>
  apiFetch<{ message: string }>(
    `/api/auth/reset-password/${token}/validate`,
  );

export const resetPasswordWithTokenApi = (token: string, password: string) =>
  apiFetch<{ message: string }>(`/api/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
