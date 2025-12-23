import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, serverTimestamp } from 'firebase/database'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

// Initialize Firebase
let app = null
let database = null

export function initFirebase() {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase config not found. Running in local-only mode.')
    return null
  }

  try {
    app = initializeApp(firebaseConfig)

    // App Check: 防止惡意腳本存取資料庫
    // 需要先在 Firebase Console 啟用 App Check 並取得 reCAPTCHA site key
    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    if (recaptchaKey) {
      // 開發環境使用 debug token
      if (import.meta.env.DEV) {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
      }
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaKey),
        isTokenAutoRefreshEnabled: true
      })
    }

    database = getDatabase(app)
    return database
  } catch (error) {
    console.error('Firebase initialization error:', error)
    return null
  }
}

// Save a placed item to Firebase
export async function saveItem(item) {
  if (!database) return null

  try {
    const itemsRef = ref(database, 'shrine/items')
    const newRef = await push(itemsRef, {
      ...item,
      createdAt: serverTimestamp()
    })
    return newRef.key
  } catch (error) {
    console.error('Error saving item:', error)
    return null
  }
}

// Subscribe to items from Firebase
export function subscribeToItems(callback) {
  if (!database) {
    callback([])
    return () => {}
  }

  const itemsRef = ref(database, 'shrine/items')
  const unsubscribe = onValue(itemsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const items = Object.entries(data).map(([id, item]) => ({
        id,
        ...item
      }))
      callback(items)
    } else {
      callback([])
    }
  })

  return unsubscribe
}
