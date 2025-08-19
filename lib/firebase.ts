import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Verificar se estamos no ambiente de build/servidor
const isServer = typeof window === "undefined"
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId

let app: any = null
let db: any = null
let storage: any = null
let auth: any = null

// Só inicializar Firebase se tivermos configuração válida e não estivermos no servidor durante build
if (hasValidConfig && !isServer) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }

    db = getFirestore(app)
    storage = getStorage(app)
    auth = getAuth(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export { db, storage, auth }
