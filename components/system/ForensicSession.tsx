"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"
import type { ForensicState } from "../api/types"
import { getLiveState } from "../api/forensicClient"

type Ctx = {
  sessionId: string | null
  forensic: ForensicState | null
  startSession: (id: string) => void
}

const ForensicContext = createContext<Ctx | null>(null)

export function ForensicSessionProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [sessionId, setSessionId] =
    useState<string | null>(null)

  const [forensic, setForensic] =
    useState<ForensicState | null>(null)

  const startSession = (id: string) => {
    setSessionId(id)
    setForensic(null)
  }

  useEffect(() => {
    if (!sessionId) return

    const poll = setInterval(async () => {
      try {
        const state = await getLiveState(sessionId)
        setForensic(state)
      } catch {}
    }, 1200)

    return () => clearInterval(poll)
  }, [sessionId])

  return (
    <ForensicContext.Provider
      value={{
        sessionId,
        forensic,
        startSession
      }}
    >
      {children}
    </ForensicContext.Provider>
  )
}

export function useForensicSession() {
  const ctx = useContext(ForensicContext)
  if (!ctx) {
    throw new Error(
      "useForensicSession must be used inside ForensicSessionProvider"
    )
  }
  return ctx
}