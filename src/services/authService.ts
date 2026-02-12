import { apiFetch } from "./api"

export interface ProfileData {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

export function login(credentials: any) {
  return apiFetch(`/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function updateAdminProfile(data: ProfileData) {
  return apiFetch(`/profile`, {
    method: "POST",
    body: JSON.stringify({
        ...data,
        _method: "PUT" 
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export function logout() {
  return apiFetch(`/logout`, {
    method: "POST",
  })
}