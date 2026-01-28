import type { ForensicReport, ForensicState } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

/* ======================
   SESSION
====================== */

export async function startSession(
  file: File
): Promise<{ sessionId: string }> {
  const form = new FormData()
  form.append("file", file)

  const res = await fetch(`${API_BASE}/session/start`, {
    method: "POST",
    body: form
  })

  if (!res.ok) {
    throw new Error("Failed to start forensic session")
  }

  return res.json()
}

/* ======================
   LIVE STATE
====================== */

export async function getLiveState(
  sessionId: string
): Promise<ForensicState> {
  const res = await fetch(
    `${API_BASE}/session/${sessionId}/state`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch forensic state")
  }

  return res.json()
}

/* ======================
   FINAL REPORT
====================== */

export async function getReport(
  sessionId: string
): Promise<ForensicReport> {
  const res = await fetch(
    `${API_BASE}/session/${sessionId}/report`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch forensic report")
  }

  return res.json()
}