export type PipelineStage =
  | "IDLE"
  | "INGEST"
  | "EXTRACT"
  | "ANALYZE"
  | "VERIFY"
  | "VERDICT"

export type VerdictState =
  | "FAKE"
  | "UNCERTAIN"
  | "LIKELY AUTHENTIC"

export type SystemStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "LIVE"
  | "DEGRADED"

export type SignalBlock = {
  rppg?: { bpm: number; snr: number }
  identity?: { drift: number }
  depth?: { valid: boolean; violations: number }
  phase?: number
  lag?: number
}

export type UIState = {
  sessionId: string | null
  backend: SystemStatus
  pipeline: PipelineStage
  verdict: VerdictState | null
  confidence: number | null
  signals: SignalBlock
  logs: string[]
  latencyMs: number | null
  streamActive: boolean
}