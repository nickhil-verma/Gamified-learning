import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function saveAuth(data) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth", JSON.stringify(data));
  }
}

export function getAuth() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("auth");
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth");
  }
}
