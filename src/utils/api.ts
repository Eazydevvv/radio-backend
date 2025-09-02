export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
