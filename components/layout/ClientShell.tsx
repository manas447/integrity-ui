"use client"

import { useEffect, useState } from "react"
import SystemHUD from "./SystemHUD"
import Loader from "./Loader"
import Noise from "./Noise"
import { WSClient } from "../system/wsClient"

/* ======================
   WS SINGLETON
   (Frontend only — backend controlled)
====================== */

const ws =
  typeof window !== "undefined"
    ? new WSClient("ws://localhost:8000/ws")
    : null

export default function ClientShell({
  children
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  /* ======================
     MOUNT GUARD
  ====================== */

  useEffect(() => {
    setMounted(true)
  }, [])

  /* ======================
     BACKEND CONNECTOR
     (No fake logic — real only)
  ====================== */

  useEffect(() => {
    if (!mounted || !ws) return

    ws.connect()
    return () => ws.disconnect()
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      {/* Global UI Layers */}
      <SystemHUD />
      <Loader />
      <Noise />

      {/* App Content */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
    </>
  )
}