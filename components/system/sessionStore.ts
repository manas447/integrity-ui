import { create } from "zustand"

export type PipelineStage =
  | "IDLE"
  | "INGEST"
  | "BIOMETRICS"
  | "DEPTH"
  | "IDENTITY"
  | "FUSION"
  | "VERDICT"
  | "COMPLETE"

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
  verdict: "FAKE" | "UNCERTAIN" | "LIKELY AUTHENTIC"
}

type Store = {
  stage: PipelineStage
  forensic: ForensicState | null
  logs: string[]

  setStage: (stage: PipelineStage) => void
  updateForensic: (patch: Partial<ForensicState>) => void
  pushLog: (line: string) => void
  reset: () => void
}

export const useSessionStore = create<Store>(set => ({
  stage: "IDLE",
  forensic: null,
  logs: [],

  setStage: stage => set({ stage }),

  updateForensic: patch =>
    set(state => ({
      forensic: {
        ...(state.forensic ?? {
          rppg: { bpm: 0, snr: 0 },
          identity: { drift: 0 },
          depth: { valid: true, violations: 0 },
          verdict: "UNCERTAIN"
        }),
        ...patch
      }
    })),

  pushLog: line =>
    set(state => ({
      logs: [...state.logs.slice(-100), line]
    })),

  reset: () =>
    set({
      stage: "IDLE",
      forensic: null,
      logs: []
    })
}))