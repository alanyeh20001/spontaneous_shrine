import { initFirebase, saveItem, subscribeToItems } from '../lib/firebase.js'

// Available items to place
export const items = [
  { id: 'candle', name: '蠟燭', emoji: '🕯️' },
  { id: 'bouquet', name: '花束', emoji: '💐' },
  { id: 'drink', name: '飲料', emoji: '🧋' },
  { id: 'cookie', name: '餅乾', emoji: '🍪' },
  { id: 'plush', name: '玩偶', emoji: '🧸' },
]

// Placed items on the scene
export const placedItems = $state({ list: [] })

// Firebase connection status
export const firebaseStatus = $state({ connected: false, loading: true })

// Selected item for mobile tap-to-place
export const selectedItem = $state({ id: null })

// Initialize Firebase and subscribe to updates
export function initShrine() {
  const db = initFirebase()

  if (db) {
    firebaseStatus.connected = true
    firebaseStatus.loading = false

    // Subscribe to real-time updates
    subscribeToItems((items) => {
      placedItems.list = items
    })
  } else {
    firebaseStatus.connected = false
    firebaseStatus.loading = false
  }
}

// Add a new placed item
export async function addPlacedItem(item) {
  const newItem = { ...item, id: crypto.randomUUID() }

  // Optimistic update - add to local state immediately
  placedItems.list = [...placedItems.list, newItem]

  // Try to save to Firebase
  if (firebaseStatus.connected) {
    const firebaseId = await saveItem(item)
    if (firebaseId) {
      // Update the local item with Firebase ID
      placedItems.list = placedItems.list.map(i =>
        i.id === newItem.id ? { ...i, id: firebaseId } : i
      )
    }
  }
}

// Get item info by id
export function getItemById(id) {
  return items.find(item => item.id === id)
}
