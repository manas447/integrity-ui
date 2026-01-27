"use client"

import { createContext, useContext, useState, useCallback, useMemo } from "react"

type BootFlags = {
  gltf: boolean
  ui: boolean
  fonts: boolean
}

type BootContextType = {
  ready: BootFlags
  markReady: (key: keyof BootFlags) => void
  isSystemReady: boolean
  progress: number
  statusLine: string
}

const BootContext = createContext<BootContextType | null>(null)

const STATUS_MAP: Record<keyof BootFlags, string> = {
  ui: "Initializing UI Layer",
  fonts: "Loading Typography System",
  gltf: "Preloading 3D Forensic Model"
}

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
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  const progress = useMemo(() => {
    const values = Object.values(ready)
    const count = values.filter(Boolean).length
    return Math.round((count / values.length) * 100)
  }, [ready])

  const statusLine = useMemo(() => {
    const pending = Object.entries(ready).find(([, v]) => !v)
    if (!pending) return "System Ready"
    return STATUS_MAP[pending[0] as keyof BootFlags]
  }, [ready])

  const isSystemReady = progress === 100

  return (
    <BootContext.Provider
      value={{
        ready,
        markReady,
        isSystemReady,
        progress,
        statusLine
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
