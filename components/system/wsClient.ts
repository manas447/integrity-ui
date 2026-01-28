"use client"

import { hudStore } from "./hudStore"

/* ======================
   TYPES
====================== */

type WSStatus = "OPEN" | "CLOSED" | "ERROR"

type BackendMessage =
  | {
      type: "session"
      sessionId: string
    }
  | {
      type: "stage"
      stage: "IDLE" | "INGEST" | "PROCESSING" | "ANALYZING" | "COMPLETE"
    }
  | {
      type: "verdict"
      verdict: "FAKE" | "UNCERTAIN" | "LIKELY AUTHENTIC"
    }
  | {
      type: "latency"
      ms: number
    }
  | {
      type: "stream"
      active: boolean
    }

/* ======================
   CLIENT
====================== */

export class WSClient {
  private socket: WebSocket | null = null
  private url: string
  private reconnectTimer: number | null = null
  private status: WSStatus = "CLOSED"

  constructor(url: string) {
    this.url = url
  }

  /* ======================
     CONNECT
  ====================== */

  connect() {
    if (this.socket || this.status === "OPEN") return

    hudStore.setBackend("CONNECTING")

    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        this.status = "OPEN"
        hudStore.setBackend("LIVE")
      }

      this.socket.onclose = () => {
        this.cleanup()
        hudStore.setBackend("DISCONNECTED")
        this.scheduleReconnect()
      }

      this.socket.onerror = () => {
        this.status = "ERROR"
        hudStore.setBackend("DISCONNECTED")
        this.cleanup()
        this.scheduleReconnect()
      }

      this.socket.onmessage = evt => {
        this.handleMessage(evt.data)
      }
    } catch {
      this.scheduleReconnect()
    }
  }

  /* ======================
     DISCONNECT
  ====================== */

  disconnect() {
    if (this.socket) {
      this.socket.close()
    }
    this.cleanup()
    hudStore.setBackend("DISCONNECTED")
  }

  /* ======================
     SEND
  ====================== */

  send(payload: unknown) {
    if (!this.socket || this.status !== "OPEN") return
    this.socket.send(JSON.stringify(payload))
  }

  /* ======================
     MESSAGE HANDLER
  ====================== */

  private handleMessage(raw: string) {
    let msg: BackendMessage | null = null

    try {
      msg = JSON.parse(raw)
    } catch {
      return
    }

    if (!msg || typeof msg !== "object" || !("type" in msg)) return

    switch (msg.type) {
      case "session":
        hudStore.setSession(msg.sessionId)
        break

      case "stage":
        hudStore.setStage(msg.stage)
        break

      case "verdict":
        hudStore.setVerdict(msg.verdict)
        break

      case "latency":
        hudStore.setLatency(msg.ms)
        break

      case "stream":
        hudStore.setStream(msg.active)
        break
    }
  }

  /* ======================
     RECONNECT LOGIC
  ====================== */

  private scheduleReconnect() {
    if (this.reconnectTimer !== null) return

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, 2000)
  }

  private cleanup() {
    if (this.socket) {
      this.socket.onopen = null
      this.socket.onclose = null
      this.socket.onerror = null
      this.socket.onmessage = null
      this.socket = null
    }
    this.status = "CLOSED"
  }
}