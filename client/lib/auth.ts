export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: "user" | "guide" | "lead-guide" | "admin";
}

export interface AuthResponse {
  status: string;
  token: string;
  data: { user: AuthUser };
}
const API_BASE = "http://localhost:3000/api/v1";

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
}

export async function signup(params: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }
  return data;
}

export async function getMe(): Promise<{ user?: AuthUser }> {
  const res = await fetch(`${API_BASE}/users/me`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to get user");
  }
  return { user: data.data?.user };
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/users/logout`, { credentials: "include" });
}

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getUserImageUrl(photo?: string): string {
  if (!photo) return `${IMG_BASE}/img/users/default.jpg`;
  return `${IMG_BASE}/img/users/${photo}`;
}
