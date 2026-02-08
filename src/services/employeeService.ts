import { apiFetch } from "./api"

export function getEmployees(params: string) {
  return apiFetch(`/employees?${params}`)
}

export function deleteEmployee(id: string) {
  return apiFetch(`/employees/${id}`, {
    method: "DELETE",
  })
}

export function createEmployee(formData: FormData) {
  return apiFetch(`/employees`, {
    method: "POST",
    body: formData,
  })
}

export function updateEmployee(id: string, formData: FormData) {
  return apiFetch(`/employees/${id}`, {
    method: "POST",
    body: formData,
  })
}
