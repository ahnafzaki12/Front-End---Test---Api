const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token")

  const baseUrl = API_BASE.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const fullUrl = `${baseUrl}/${cleanEndpoint}`;

  console.log("Menghubungi URL:", fullUrl);

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || "API Error")
  }

  return data
}