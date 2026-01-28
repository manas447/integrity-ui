"use client"

import { useSyncExternalStore } from "react"

/* ======================
   TYPES
====================== */

export type BackendStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "LIVE"

export type PipelineStage =
  | "IDLE"
  | "INGEST"
  | "PROCESSING"
  | "ANALYZING"
  | "COMPLETE"

export type VerdictState =
  | "FAKE"
  | "UNCERTAIN"
  | "LIKELY AUTHENTIC"

export type HUDState = {
  sessionId: string | null
  backend: BackendStatus
  stage: PipelineStage
  latency: number
  verdict: VerdictState
  stream: boolean
}

/* ======================
   INTERNAL STORE
====================== */

let state: HUDState = {
  sessionId: null,
  backend: "DISCONNECTED",
  stage: "IDLE",
  latency: 0,
  verdict: "UNCERTAIN",
  stream: false
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(l => l())
}

/* ======================
   STORE API
====================== */

export const hudStore = {
  get() {
    return state
  },

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  setSession(id: string | null) {
    state = { ...state, sessionId: id }
    emit()
  },

  setBackend(status: BackendStatus) {
    state = { ...state, backend: status }
    emit()
  },

  setStage(stage: PipelineStage) {
    state = { ...state, stage }
    emit()
  },

  setLatency(ms: number) {
    state = { ...state, latency: ms }
    emit()
  },

  setVerdict(v: VerdictState) {
    state = { ...state, verdict: v }
    emit()
  },

  setStream(active: boolean) {
    state = { ...state, stream: active }
    emit()
  }
}

/* ======================
   REACT HOOK
====================== */

export function useHUD(): HUDState {
  return useSyncExternalStore(
    hudStore.subscribe,
    hudStore.get,
    hudStore.get
  )
}