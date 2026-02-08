import type { Item } from "../types/item"

const KEY = 'items'

export function getItems(): Item[] {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveItems(items: Item[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}
