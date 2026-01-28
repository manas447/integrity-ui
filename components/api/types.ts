export type VerdictResult =
  | "FAKE"
  | "UNCERTAIN"
  | "LIKELY AUTHENTIC"

export type ForensicState = {
  rppg: {
    bpm: number
    snr: number
  }
  identity: {
    drift: number
  }
  depth: {
    valid: boolean
    violations: number
  }
  verdict: VerdictResult
}

export type ForensicReport = {
  sessionId: string
  timestamp: string

  media: {
    filename: string
    type: string
    sizeMB: number
  }

  verdict: {
    result: VerdictResult
    systemConfidence: number
    probabilityReal: number
  }

  tier0: {
    captureLikelihood: number
    survivability: "HIGH" | "MEDIUM" | "LOW"
    derived: boolean
    notes: string
  }

  signals: ForensicState
  riskDrivers: string[]

  system: {
    version: string
    modelStack: string[]
    environment: string
  }
}