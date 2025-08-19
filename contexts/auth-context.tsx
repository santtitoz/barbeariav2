"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface UserProfile {
  name: string
  phone: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, phone: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined" || !auth) {
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)

        if (user && db) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile)
            }
          } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error)
          }
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("Auth state change error:", error)
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not available")
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, name: string, phone: string) => {
    if (!auth || !db) throw new Error("Firebase not available")

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, { displayName: name })

    const userProfile: UserProfile = {
      name,
      phone,
      createdAt: new Date(),
    }

    await setDoc(doc(db, "users", user.uid), userProfile)
    setUserProfile(userProfile)
  }

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth not available")
    await signOut(auth)
    setUserProfile(null)
  }

  // Admin é apenas quem tem o email específico
  const isAdmin = user?.email === "admin@barbearia.com"

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
