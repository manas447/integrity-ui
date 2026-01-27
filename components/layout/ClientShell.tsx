"use client"

import { useEffect } from "react"
import Noise from "./Noise"
import { useSystemBoot } from "../system/SystemBoot"

export default function ClientShell({
  children
}: {
  children: React.ReactNode
}) {
  const { markReady } = useSystemBoot()

  useEffect(() => {
    document.fonts.ready.then(() => {
      markReady("fonts")
    })
  }, [markReady])

  return (
    <>
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(124,124,255,0.06),transparent_60%)]" />
      <Noise />
      {children}
    </>
  )
}
