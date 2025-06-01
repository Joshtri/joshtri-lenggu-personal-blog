// lib/firebase.js
import { initializeApp } from 'firebase/app'
import { getStorage, ref, deleteObject } from 'firebase/storage'
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)

export async function deleteFileFromFirebase(fileUrl : string) {
  try {
    // Extract file path from URL
    const filePath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0])
    const fileRef = ref(storage, filePath)
    await deleteObject(fileRef)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
} 