import { apiFetch } from "./api"

export function getDivisions(name = "") {
  return apiFetch(`/divisions?name=${name}`)
}
