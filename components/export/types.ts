import type { ForensicState } from "../layout/ForensicHead"

/* ======================
   CORE ENUMS
====================== */

export type VerdictResult =
  | "FAKE"
  | "UNCERTAIN"
  | "LIKELY AUTHENTIC"

/* ======================
   BLOCK TYPES
====================== */

export type VerdictBlock = {
  result: VerdictResult
  systemConfidence: number
  probabilityReal: number
}

export type Tier0Block = {
  captureLikelihood: number
  survivability: "HIGH" | "MEDIUM" | "LOW"
  derived: boolean
  notes: string
}

export type MediaBlock = {
  filename: string
  type: string
  sizeMB: number
}

export type SystemBlock = {
  version: string
  modelStack: string[]
  environment: string
}

/* ======================
   SIGNATURE BLOCK
====================== */

export type SignatureBlock = {
  publicKey: string
  signature: string
}

/* ======================
   INTEGRITY BLOCK
====================== */

export type IntegrityBlock = {
  reportHash: string
  signed: boolean
  signatureValid: boolean
  signature: SignatureBlock
}

/* ======================
   FORENSIC REPORT
====================== */

export type ForensicReport = {
  sessionId: string
  timestamp: string

  media: MediaBlock
  verdict: VerdictBlock
  tier0: Tier0Block

  signals: ForensicState
  riskDrivers: string[]

  system: SystemBlock
  integrity: IntegrityBlock
}
