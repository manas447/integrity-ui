"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useForensicSession } from "../system/ForensicSession"
import type { ForensicState } from "../layout/ForensicHead"

const ForensicHead = dynamic(
  () => import("../layout/ForensicHead"),
  { ssr: false }
)

const SIGNALS = [
  { key: "rppg", label: "rPPG Heart Signal" },
  { key: "identity", label: "Identity Drift" },
  { key: "depth", label: "MiDaS Depth" },
  { key: "phase", label: "Phase Correlation" },
  { key: "lag", label: "Temporal Lag" }
]

function computeSignalStrength(
  key: string,
  forensic: ForensicState
): number {
  switch (key) {
    case "rppg":
      return Math.min(100, forensic.rppg.snr * 40 + 30)
    case "identity":
      return Math.max(0, 100 - forensic.identity.drift * 7)
    case "depth":
      return forensic.depth.valid ? 85 : 20
    case "phase":
      return forensic.verdict === "FAKE" ? 30 : 70
    case "lag":
      return forensic.verdict === "FAKE" ? 35 : 75
    default:
      return 60
  }
}

export default function SystemFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [uiProgress, setUiProgress] = useState(0)

  const { forensic, updateForensic } = useForensicSession()

  useEffect(() => {
    const interval = setInterval(() => {
      updateForensic({
        rppg: {
          bpm:
            forensic.rppg.bpm +
            (Math.random() - 0.5) * 2,
          snr: Math.max(
            0.3,
            forensic.rppg.snr +
              (Math.random() - 0.5) * 0.15
          )
        },
        identity: {
          drift: Math.max(
            0,
            forensic.identity.drift +
              (Math.random() - 0.5) * 0.4
          )
        },
        depth: {
          valid: Math.random() > 0.65,
          violations: Math.random() > 0.65 ? 0 : 93
        },
        verdict:
          forensic.identity.drift > 7 ||
          forensic.rppg.snr < 1.0 ||
          !forensic.depth.valid
            ? "FAKE"
            : "REAL"
      })
    }, 1400)

    return () => clearInterval(interval)
  }, [forensic, updateForensic])

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const visible = Math.min(
        1,
        Math.max(0, 1 - rect.top / (vh * 1.15))
      )
      setUiProgress(visible)
    }

    window.addEventListener("scroll", onScroll)
    onScroll()
    return () =>
      window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black text-white flex items-center justify-center px-6"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16">

        <motion.div
          className="flex flex-col items-center justify-center"
          animate={{ scale: 0.9 + uiProgress * 0.15 }}
        >
          <div className="w-full max-w-md">
            <ForensicHead forensic={forensic} />
          </div>

          <div className="mt-6 text-center space-y-1">
            <p className="text-xs tracking-widest text-gray-500">
              LIVE FORENSIC VISUALIZATION
            </p>
            <p
              className={`text-sm tracking-widest ${
                forensic.verdict === "FAKE"
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              VERDICT — {forensic.verdict}
            </p>
          </div>
        </motion.div>

        <div className="space-y-4 pl-6">
          {SIGNALS.map((s, i) => {
            const strength = computeSignalStrength(
              s.key,
              forensic
            )

            return (
              <div
                key={i}
                className="p-4 border border-gray-700 rounded-lg bg-[#0b0b0b]"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm tracking-wide">
                    {s.label}
                  </span>
                  <span className="text-xs text-indigo-400">
                    {Math.round(strength)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${strength}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
