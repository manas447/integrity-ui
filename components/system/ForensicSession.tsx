"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode
} from "react"

import type { ForensicState } from "../layout/ForensicHead"
import type { ForensicReport } from "../export/types"
import { buildReport as buildReportInternal } from "../export/buildReport"

/* ======================
   TYPES
====================== */

type ForensicSessionContextType = {
  forensic: ForensicState
  filename: string | null

  updateForensic: (next: ForensicState) => void
  setFilename: (name: string | null) => void

  buildReport: () => Promise<ForensicReport>
}

/* ======================
   DEFAULT STATE
====================== */

const DEFAULT_FORENSIC: ForensicState = {
  rppg: {
    bpm: 72,
    snr: 1.4
  },
  identity: {
    drift: 2.5
  },
  depth: {
    valid: true,
    violations: 0
  },
  verdict: "REAL"
}

/* ======================
   CONTEXT
====================== */

const ForensicSessionContext =
  createContext<ForensicSessionContextType | null>(null)

/* ======================
   PROVIDER
====================== */

export function ForensicSessionProvider({
  children
}: {
  children: ReactNode
}) {
  const [forensic, setForensic] =
    useState<ForensicState>(DEFAULT_FORENSIC)

  const [filename, setFilename] =
    useState<string | null>(null)

  const updateForensic = useCallback(
    (next: ForensicState) => {
      setForensic(next)
    },
    []
  )

  const buildReport = useCallback(async () => {
    return await buildReportInternal(forensic, filename)
  }, [forensic, filename])

  const value = useMemo(
    () => ({
      forensic,
      filename,
      updateForensic,
      setFilename,
      buildReport
    }),
    [forensic, filename, updateForensic, buildReport]
  )

  return (
    <ForensicSessionContext.Provider value={value}>
      {children}
    </ForensicSessionContext.Provider>
  )
}

/* ======================
   HOOK
====================== */

export function useForensicSession() {
  const ctx = useContext(ForensicSessionContext)

  if (!ctx) {
    throw new Error(
      "useForensicSession must be used inside ForensicSessionProvider"
    )
  }

  return ctx
}
