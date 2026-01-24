"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import type { ForensicState } from "../layout/ForensicHead"

const ForensicHead = dynamic(
  () => import("../layout/ForensicHead"),
  { ssr: false }
)

const signals = [
  "rPPG Heart Signal",
  "Micro-Expressions",
  "Eye Convergence",
  "Lighting Variance",
  "Depth Motion",
  "MiDaS Depth",
  "Identity Drift",
  "Phase Correlation",
  "Temporal Lag"
]

const forensicLogs = [
  "[TIER-0] Capture Likelihood: 0.70",
  "[TIER-0] Survivability: HIGH",
  "[rPPG] BPM: 73.7 | SNR: 1.70 | Conf: 0.34",
  "[MicroExpr] Count: 23 | Mean: 33ms",
  "[Depth] MiDaS INVALID | Violations: 93",
  "[Identity] Drift: 9.59",
  "[Phase] Corr: -0.59",
  "[Lag] Frames: 39",
  "[Verdict] P(real): 0.000"
]

export default function SystemFlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)

  const [forensic, setForensic] = useState<ForensicState>({
    rppg: { bpm: 73.7, snr: 1.7 },
    identity: { drift: 9.59 },
    depth: { valid: false, violations: 93 },
    verdict: "FAKE"
  })

  // Scroll-based progress (UI only)
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const visible = Math.min(
        1,
        Math.max(0, 1 - rect.top / (windowHeight * 1.2))
      )

      setProgress(visible)
    }

    window.addEventListener("scroll", onScroll)
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Simulated backend stream
  useEffect(() => {
    const interval = setInterval(() => {
      setForensic((prev) => ({
        ...prev,
        rppg: {
          bpm: prev.rppg.bpm + (Math.random() - 0.5),
          snr: Math.max(
            0.5,
            prev.rppg.snr + (Math.random() - 0.5) * 0.1
          )
        }
      }))
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black text-white flex items-center justify-center"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* LEFT — FORENSIC HEAD CORE */}
        <motion.div
          className="flex flex-col items-center justify-center"
          animate={{
            scale: 0.9 + progress * 0.2
          }}
          transition={{ ease: "easeOut" }}
        >
          <div className="w-full max-w-md">
            <ForensicHead forensic={forensic} />
          </div>

          {/* Core Status */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-xs tracking-widest text-gray-500">
              LIVE FORENSIC SIGNAL VISUALIZATION
            </p>
            <p className="text-sm text-indigo-400">
              Face: 0 · Verdict: {forensic.verdict}
            </p>
            <p className="text-xs text-gray-500">
              UI Progress: {Math.round(progress * 100)}%
            </p>
          </div>
        </motion.div>

        {/* RIGHT — SIGNAL METERS + FORENSIC LOG */}
        <div className="relative w-full">

          {/* Vertical Data Spine */}
          <div className="absolute left-1 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />

          {/* SIGNAL METERS */}
          <div className="space-y-4 pl-6">
            {signals.map((s, i) => {
              const strength = Math.min(
                100,
                Math.round(progress * 100 - i * 6 + 40)
              )

              return (
                <div
                  key={i}
                  className="p-4 border border-gray-700 rounded-lg bg-[#0b0b0b]"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm tracking-wide">
                      {s}
                    </span>
                    <span className="text-xs text-indigo-400">
                      {strength}%
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

          {/* FORENSIC LOG STACK */}
          <div className="mt-10 pl-6 space-y-3">
            {forensicLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="font-mono text-xs p-3 border border-gray-800 rounded bg-[#0f0f0f] text-gray-400"
              >
                {log}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
