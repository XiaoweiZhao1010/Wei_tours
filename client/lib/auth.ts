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
/** Same origin as the Next app so httpOnly `jwt` is set for this host (rewrites to API in next.config). */
const API_BASE = "/api/v1";

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
  role?: AuthUser["role"];
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

export async function forgotPassword(
  email: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/users/forgotPassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not send reset email");
  }
  return { message: data.message ?? "Token sent to email!" };
}

export async function resetPasswordWithToken(
  token: string,
  body: { password: string; passwordConfirm: string },
): Promise<AuthResponse> {
  const res = await fetch(
    `${API_BASE}/users/resetPassword/${encodeURIComponent(token)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    },
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not reset password");
  }
  return data;
}

export async function updateMe(updates: {
  name?: string;
  email?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/users/updateMe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile");
  }
}

export async function updatePassword(params: {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/users/updatePassword`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update password");
  }
}

export async function updateProfilePicture(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await fetch(`${API_BASE}/users/updateProfilePicture`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile photo");
  }
}

const IMG_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getUserImageUrl(photo?: string): string {
  if (!photo) return `${IMG_BASE}/img/users/default.jpg`;
  return `${IMG_BASE}/img/users/${photo}`;
}
