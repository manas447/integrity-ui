"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

export type BootFlag = "ui" | "fonts" | "socket"

type BootState = Record<BootFlag, boolean>

type BootContextType = {
  ready: BootState
  markReady: (key: BootFlag) => void
  progress: number
  statusLine: string
  isSystemReady: boolean
}

const BootContext = createContext<BootContextType | null>(null)

const STATUS_MAP: Record<BootFlag, string> = {
  ui: "Initializing UI Layer",
  fonts: "Loading Typography System",
  socket: "Connecting Forensic Backend"
}

export function SystemBootProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState<BootState>({
    ui: false,
    fonts: false,
    socket: false
  })

  const markReady = useCallback((key: BootFlag) => {
    setReady(prev => {
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
  }, [])

  const progress = useMemo(() => {
    const values = Object.values(ready)
    const done = values.filter(Boolean).length
    return Math.round((done / values.length) * 100)
  }, [ready])

  const statusLine = useMemo(() => {
    const pending = Object.entries(ready).find(([, v]) => !v)
    if (!pending) return "System Ready"
    return STATUS_MAP[pending[0] as BootFlag]
  }, [ready])

  return (
    <BootContext.Provider
      value={{
        ready,
        markReady,
        progress,
        statusLine,
        isSystemReady: progress === 100
      }}
    >
      {children}
    </BootContext.Provider>
  )
}

export function useSystemBoot() {
  const ctx = useContext(BootContext)
  if (!ctx) {
    throw new Error("useSystemBoot must be used inside SystemBootProvider")
  }
  return ctx
}