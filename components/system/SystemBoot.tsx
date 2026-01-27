"use client"

import { createContext, useContext, useState, useCallback } from "react"

type BootFlags = {
  gltf: boolean
  ui: boolean
  fonts: boolean
}

type BootContextType = {
  ready: BootFlags
  markReady: (key: keyof BootFlags) => void
  isSystemReady: boolean
}

const BootContext = createContext<BootContextType | null>(null)

export function SystemBootProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState<BootFlags>({
    gltf: false,
    ui: false,
    fonts: false
  })

  const markReady = useCallback((key: keyof BootFlags) => {
    setReady(prev => {
      // CRITICAL GUARD — prevents infinite render loops
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  const isSystemReady =
    ready.gltf &&
    ready.ui &&
    ready.fonts

  return (
    <BootContext.Provider
      value={{
        ready,
        markReady,
        isSystemReady
      }}
    >
      {children}
    </BootContext.Provider>
  )
}

export function useSystemBoot() {
  const ctx = useContext(BootContext)
  if (!ctx) {
    throw new Error("useSystemBoot must be inside SystemBootProvider")
  }
  return ctx
}
